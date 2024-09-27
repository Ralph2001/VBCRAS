import sys
import os
import win32com.client

def convert_docx_to_pdf(word, docx_path, pdf_path):
    try:
        doc = word.Documents.Open(docx_path)
        doc.SaveAs(pdf_path, FileFormat=17)  # FileFormat=17 is for PDF
        doc.Close()
    except Exception as e:
        print(f"Failed to convert '{docx_path}': {e}")

def main(args):
    if len(args) < 3:
        print("Usage: convert.exe <input_folder> <output_folder> <delete_original>")
        return

    input_folder = args[0]
    output_folder = args[1]
    delete_original = args[2].lower() in ('true', '1')

    os.makedirs(output_folder, exist_ok=True)

    # Create an instance of Word application
    word = win32com.client.Dispatch('Word.Application')
    word.Visible = False  # Keep Word hidden

    try:
        for file_name in os.listdir(input_folder):
            if file_name.endswith('.docx'):
                input_docx_path = os.path.join(input_folder, file_name)
                pdf_path = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.pdf")

                convert_docx_to_pdf(word, input_docx_path, pdf_path)
                print(f"Converted '{input_docx_path}' to '{pdf_path}")

                if delete_original:
                    os.remove(input_docx_path)
                    print(f"Deleted original file: '{input_docx_path}'")
    finally:
        word.Quit()

if __name__ == "__main__":
    main(sys.argv[1:])
