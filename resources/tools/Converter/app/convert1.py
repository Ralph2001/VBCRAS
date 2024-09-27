import sys
import os
import win32com.client

def convert_docx_to_pdf(docx_path, pdf_path):
    # Create an instance of Word application
    word = win32com.client.Dispatch('Word.Application')
    try:
        # Open the document
        doc = word.Documents.Open(docx_path)
        # Save as PDF
        doc.SaveAs(pdf_path, FileFormat=17)  # FileFormat=17 is for PDF
        doc.Close()
    except Exception as e:
        print(f"Failed to convert '{docx_path}': {e}")
    finally:
        # Quit the Word application
        word.Quit()

def main(args):
    if len(args) < 3:
        print("Usage: convert.exe <input_folder> <output_folder> <delete_original>")
        return

    input_folder = args[0]
    output_folder = args[1]
    delete_original = args[2].lower() in ('true', '1')

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Iterate over all .docx files in the input folder
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.docx'):
            input_docx_path = os.path.join(input_folder, file_name)

            # Create the PDF path based on the output folder
            pdf_path = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.pdf")

            try:
                convert_docx_to_pdf(input_docx_path, pdf_path)
                print(f"Converted '{input_docx_path}' to '{pdf_path}'")

                # Delete original .docx if specified
                if delete_original:
                    os.remove(input_docx_path)
                    print(f"Deleted original file: '{input_docx_path}'")
            except Exception as e:
                print(f"An error occurred while converting '{input_docx_path}': {e}")

if __name__ == "__main__":
    main(sys.argv[1:])
