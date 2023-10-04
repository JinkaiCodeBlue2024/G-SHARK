import base64
import string
from zlib import compress
from typing import Tuple
import xml.etree.ElementTree as et

import requests


PLANTUML_BASE_URL = "http://www.plantuml.com/plantuml/svg/"


def deflate(code: str) -> str:
    """
    Compress for PlantUML API.
    """
    puml_chars = string.digits + string.ascii_uppercase + string.ascii_lowercase + "-_"
    b64_str = string.ascii_uppercase + string.ascii_lowercase + string.digits + "+/"
    b64_to_puml = bytes.maketrans(b64_str.encode("utf-8"), puml_chars.encode("utf-8"))

    zlibbled_str = compress(code.encode("utf-8"))
    compressed_str = zlibbled_str[2:-4]

    encoded = base64.b64encode(compressed_str).translate(b64_to_puml).decode("utf-8")
    return encoded


def get_svg(code: str) -> str:
    """
    Get an SVG image using PlantUML API.
    """
    encoded = deflate(code)
    response = requests.get(PLANTUML_BASE_URL + encoded)
    return response.content


def check_plantuml_syntax(svg_code: str) -> Tuple[int, str]:
    """
    Check the contents of the SVG file obtained from the PlantUML API and detect syntax errors.

    :return 1(int): no syntax errors -> 0, syntax errors -> -1
    :return 2(str): no syntax errors -> SVG, syntax errors -> error message
    """
    root = et.fromstring(svg_code)
    SVG_G_TAG = "{http://www.w3.org/2000/svg}g"
    SVG_TEXT_TAG = "{http://www.w3.org/2000/svg}text"
    g_elems = root.find(SVG_G_TAG)
    text_elems = g_elems.findall(SVG_TEXT_TAG)
    text_list = [child.text for child in text_elems]

    error_detection_string = "[From string (line"
    error_flag = False
    if error_detection_string in " ".join(text_list):
        error_flag = True

    if error_flag:
        status = -1
        all_text = " ".join(text_list)
        error_message_part = all_text[all_text.index(error_detection_string):]
        response = error_message_part.replace("\xa0", "\n")
    else:
        status = 0
        response = svg_code

    return status, response


def generate_figure_code(figure_system_prompt: str, figure_user_prompt: str) -> str:
    """
    Regenerate using ChatGPT if there are syntax errors and return the final PlantUML code.
    """
    from create_scenario import chat_with_gpt

    MAX_NUM_OF_REGENERATE = 3

    figure_response = chat_with_gpt(figure_system_prompt, figure_user_prompt)
    print(f"{figure_response = }")
    plantuml_response = get_svg(figure_response)

    for i in range(MAX_NUM_OF_REGENERATE):
        status, check_response = check_plantuml_syntax(plantuml_response)
        if status == 0:
            break

        figure_user_prompt = (
            "There was an error in this PlantUML code, resulting in a syntax error. "
            + "Please fix it based on the hint."
            + "\n"
            + "<code>"
            + "\n"
            + figure_response
            + "\n\n"
            + "<hint>"
            + check_response
        )

        figure_response = chat_with_gpt(figure_system_prompt, figure_user_prompt)
        print(f"figure_response regenerate {i} = {figure_response}")
        plantuml_response = get_svg(figure_response)

    return figure_response
