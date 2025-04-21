'use server';
/**
 * @fileOverview AI-powered transport recommendation flow.
 *
 * - recommendTransport - A function that recommends the best transport option.
 * - RecommendTransportInput - The input type for the recommendTransport function.
 * - RecommendTransportOutput - The return type for the recommendTransport function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Weather, getWeather} from '@/services/weather';
import {TransportOption, getTransportOptions} from '@/services/transport';

const RecommendTransportInputSchema = z.object({
  destination: z.string().describe('The destination of the journey.'),
  userPreferences: z
    .object({
      maxFare: z.number().optional().describe('The maximum acceptable fare.'),
      maxEta: z.number().optional().describe('The maximum acceptable ETA in minutes.'),
      weatherConsiderations: z
        .boolean()
        .optional()
        .describe('Whether to consider weather conditions in the recommendation.'),
    })
    .optional()
    .describe('The user preferences for transport recommendations.'),
});

export type RecommendTransportInput = z.infer<typeof RecommendTransportInputSchema>;

const RecommendTransportOutputSchema = z.object({
  recommendation: z.string().describe('The recommended transport option and reasoning.'),
});

export type RecommendTransportOutput = z.infer<typeof RecommendTransportOutputSchema>;

export async function recommendTransport(input: RecommendTransportInput): Promise<RecommendTransportOutput> {
  return recommendTransportFlow(input);
}

const recommendTransportPrompt = ai.definePrompt({
  name: 'recommendTransportPrompt',
  input: {
    schema: z.object({
      destination: z.string().describe('The destination of the journey.'),
      transportOptions: z.array(z.any()).describe('The available transport options.'),
      weather: z.any().describe('The current weather conditions.'),
      userPreferences: z
        .object({
          maxFare: z.number().optional().describe('The maximum acceptable fare.'),
          maxEta: z.number().optional().describe('The maximum acceptable ETA in minutes.'),
          weatherConsiderations: z
            .boolean()
            .optional()
            .describe('Whether to consider weather conditions in the recommendation.'),
        })
        .optional()
        .describe('The user preferences for transport recommendations.'),
    }),
  },
  output: {
    schema: z.object({
      recommendation: z.string().describe('The recommended transport option and reasoning.'),
    }),
  },
  prompt: `Given the following transport options to {{{destination}}}:\n\n{{#each transportOptions}}\n- Type: {{this.type}}, ETA: {{this.eta}} minutes, Fare: ₹{{this.fare.amount}}\n{{/each}}\n\nAnd the current weather conditions: {{{weather.conditions}}} with temperature {{{weather.temperatureFarenheit}}}°F.\n\n{% raw %}{{ #if userPreferences }}{% endraw %}
Considering the user preferences:
{% raw %}{{ #if userPreferences.maxFare }}{% endraw %}Maximum fare: ₹{{{userPreferences.maxFare}}}{% raw }}{{ /if }}{% endraw %}
{% raw %}{{ #if userPreferences.maxEta }}{% endraw %}Maximum ETA: {{{userPreferences.maxEta}}} minutes{% raw }}{{ /if }}{% endraw %}
{% raw %}{{ #if userPreferences.weatherConsiderations }}{% endraw %}Weather considerations: Yes{% raw }}{{ /if }}{% endraw %}
{% raw %}{{ /if }}{% endraw %}
\nRecommend the best transport option, explaining your reasoning based on ETA, fare, weather conditions, and user preferences, if available.`,
});

const recommendTransportFlow = ai.defineFlow<
  typeof RecommendTransportInputSchema,
  typeof RecommendTransportOutputSchema
>(
  {
    name: 'recommendTransportFlow',
    inputSchema: RecommendTransportInputSchema,
    outputSchema: RecommendTransportOutputSchema,
  },
  async input => {
    const transportOptions = await getTransportOptions(input.destination);
    const weather: Weather = await getWeather({lat: 19.0760, lng: 72.8777}); // Hardcoded Mumbai location

    const {output} = await recommendTransportPrompt({
      destination: input.destination,
      transportOptions,
      weather,
      userPreferences: input.userPreferences,
    });

    return output!;
  }
);
