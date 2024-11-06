import sys
import fitz  # PyMuPDF

def extract_field_positions(pdf_path):
    doc = fitz.open(pdf_path)
    field_positions = []

    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        # Iterate through form fields (if any)
        for field in page.widgets():
            field_name = field.field_name
            rect = field.rect  # Rectangle that bounds the field
            field_positions.append({
                'field_name': field_name,
                'rect': {
                    'x0': rect.x0,
                    'y0': rect.y0,
                    'x1': rect.x1,
                    'y1': rect.y1
                },
                'page': page_num
            })
    
    return field_positions

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    field_positions = extract_field_positions(pdf_path)
    print(field_positions)  