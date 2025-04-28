import os
import json

def download_files(file_list):
    """
    Downloads files from a list, preserving folder structure.

    Args:
        file_list (list): A list of file paths relative to the project root.
    """

    download_dir = "download"

    # Create the download directory if it doesn't exist
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    for file_path in file_list:
        try:
            # Read the file using the read_file tool
            file_content = read_file_content(file_path)

            # Construct the full path for the output file
            output_path = os.path.join(download_dir, file_path)

            # Create the directory structure if it doesn't exist
            output_dir = os.path.dirname(output_path)
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)

            # Write the file content
            with open(output_path, "w", encoding="utf-8") as output_file:
                output_file.write(file_content)

            print(f"Downloaded: {file_path} -> {output_path}")

        except Exception as e:
            print(f"Error downloading {file_path}: {e}")

def read_file_content(file_path):
    """
    Reads a file using the read_file tool and returns the content.

    Args:
        file_path (str): The path to the file to read.

    Returns:
        str: The content of the file.
    """
    try:
        response = default_api.read_file(path=file_path)
        return response.get("read_file_response", {}).get("result", "")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

file_list = ["README.md", "components.json", "next.config.ts", "package-lock.json", "package.json", "postcss.config.mjs", "tailwind.config.ts", "tsconfig.json", ".idx/dev.nix", ".vscode/settings.json", "docs/blueprint.md", "src/ai/ai-instance.ts", "src/ai/dev.ts", "src/app/favicon.ico", "src/app/globals.css", "src/app/layout.tsx", "src/app/page.tsx", "src/components/icons.ts", "src/hooks/use-mobile.tsx", "src/hooks/use-toast.ts", "src/lib/utils.ts", "src/services/location.ts", "src/services/transport.ts", "src/services/weather.ts", "src/ai/flows/recommend-transport.ts", "src/components/ui/accordion.tsx", "src/components/ui/alert-dialog.tsx", "src/components/ui/alert.tsx", "src/components/ui/avatar.tsx", "src/components/ui/badge.tsx", "src/components/ui/button.tsx", "src/components/ui/calendar.tsx", "src/components/ui/card.tsx", "src/components/ui/chart.tsx", "src/components/ui/checkbox.tsx", "src/components/ui/dialog.tsx", "src/components/ui/dropdown-menu.tsx", "src/components/ui/form.tsx", "src/components/ui/input.tsx", "src/components/ui/label.tsx", "src/components/ui/menubar.tsx", "src/components/ui/popover.tsx", "src/components/ui/progress.tsx", "src/components/ui/radio-group.tsx", "src/components/ui/scroll-area.tsx", "src/components/ui/select.tsx", "src/components/ui/separator.tsx", "src/components/ui/sheet.tsx", "src/components/ui/sidebar.tsx", "src/components/ui/skeleton.tsx", "src/components/ui/slider.tsx", "src/components/ui/switch.tsx", "src/components/ui/table.tsx", "src/components/ui/tabs.tsx", "src/components/ui/textarea.tsx", "src/components/ui/toast.tsx", "src/components/ui/toaster.tsx", "src/components/ui/tooltip.tsx"]
download_files(file_list)