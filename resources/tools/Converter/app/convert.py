import os
import sys
import time
import win32com.client
import pythoncom

def convert_docx_to_pdf_word(docx_path, pdf_path, retries=3):
    """Attempt to convert using Microsoft Word."""
    for attempt in range(retries):
        try:
            # Create an instance of Word application
            word = win32com.client.Dispatch('Word.Application')
            word.Visible = False  # Keep Word hidden
            
            # Open the document
            doc = word.Documents.Open(docx_path)
            doc.SaveAs(pdf_path, FileFormat=17)  # 17 is the format for PDF
            doc.Close()
            word.Quit()
            return True  # Indicate success
        except Exception as e:
            print(f"[Word] Error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                time.sleep(2)  # Wait before retrying
            else:
                print(f"[Word] Failed to convert '{docx_path}' after {retries} attempts.")
                return False

def convert_docx_to_pdf_wps(docx_path, pdf_path, retries=3):
    """Attempt to convert using WPS Office."""
    for attempt in range(retries):
        try:
            # Create an instance of WPS application
            wps = win32com.client.Dispatch('KWPS.Application')
            wps.Visible = False  # Keep WPS hidden
            
            # Open the document
            doc = wps.Documents.Open(docx_path)
            doc.SaveCopyAs(pdf_path)  # Use SaveCopyAs for WPS
            doc.Close()
            wps.Quit()
            return True  # Indicate success
        except Exception as e:
            print(f"[WPS] Error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                time.sleep(2)  # Wait before retrying
            else:
                print(f"[WPS] Failed to convert '{docx_path}' after {retries} attempts.")
                return False

def convert_docx_to_pdf(docx_path, pdf_path):
    """Try to convert DOCX to PDF using Word, then WPS if it fails."""
    print(f"Trying to convert '{docx_path}' to '{pdf_path}' using Microsoft Word...")
    
    if convert_docx_to_pdf_word(docx_path, pdf_path):
        return True  # Conversion successful with Word

    print(f"Trying to convert '{docx_path}' to '{pdf_path}' using WPS Office...")
    return convert_docx_to_pdf_wps(docx_path, pdf_path)

def main(args):
    if len(args) < 3:
        print("Usage: convert.exe <input_folder> <output_folder> <delete_original>")
        return

    input_folder = args[0]
    output_folder = args[1]
    delete_original = args[2].lower() in ('true', '1')

    os.makedirs(output_folder, exist_ok=True)

    for file_name in os.listdir(input_folder):
        if file_name.endswith('.docx'):
            input_docx_path = os.path.join(input_folder, file_name)
            pdf_path = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.pdf")

            if convert_docx_to_pdf(input_docx_path, pdf_path):
                print(f"Converted '{input_docx_path}' to '{pdf_path}'")

                if delete_original:
                    os.remove(input_docx_path)
                    print(f"Deleted original file: '{input_docx_path}'")
            else:
                print(f"Skipping file '{input_docx_path}' due to conversion failure.")

if __name__ == "__main__":
    main(sys.argv[1:])
