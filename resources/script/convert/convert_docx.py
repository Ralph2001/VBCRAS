import win32com.client
import os
import sys

current_dir = os.getcwd()
generated_dir = os.path.join(current_dir)

word = win32com.client.Dispatch("Word.Application")
word.visible = False

# Iterate through files in the generated directory
for filename in os.listdir(generated_dir):
    if filename.endswith(".docx"):  # Check if it's a DOCX file
        input_file = os.path.join(generated_dir, filename)
        output_file = os.path.join(
            generated_dir, filename.replace(".docx", ".pdf")
        )  # Replace extension

        doc = word.Documents.Open(input_file)
        doc.SaveAs(output_file, FileFormat=17)
        doc.Close()

sys.exit(0)
