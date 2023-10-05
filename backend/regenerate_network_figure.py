import base64
import string
from zlib import compress
from typing import Tuple

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


def check_plantuml_syntax(plantuml_code: str) -> Tuple[int, str]:
    """
    Check the contents of the SVG file obtained from the PlantUML API and detect syntax errors.

    :return 1(int): no syntax errors -> 0, syntax errors -> -1
    :return 2(str): no syntax errors -> SVG data, syntax errors -> error message
    """
    encoded = deflate(plantuml_code)
    response = requests.get(PLANTUML_BASE_URL + encoded)

    description = response.headers["X-Plantuml-Diagram-Description"]
    if description == "(Error)":
        status = -1
        error = response.headers["X-Plantuml-Diagram-Error"]
        error_line = response.headers["X-Plantuml-Diagram-Error-Line"]
        check_response = f"Error: {error}\nError Line: {error_line}\n"
    else:
        status = 0
        check_response = response.content
    print(f"{check_response = }")

    return status, check_response


def generate_figure_code(figure_system_prompt: str, figure_user_prompt: str) -> str:
    """
    Regenerate using ChatGPT if there are syntax errors and return the final PlantUML code.
    """
    from create_scenario import chat_with_gpt

    MAX_NUM_OF_REGENERATE = 3

    figure_response = chat_with_gpt(figure_system_prompt, figure_user_prompt)
    print(f"{figure_response = }")

    for i in range(MAX_NUM_OF_REGENERATE):
        status, check_response = check_plantuml_syntax(figure_response)
        if status == 0:
            break

        figure_user_prompt = (
            "There was an error in this PlantUML code, resulting in a syntax error. "
            + "Please fix it based on the hint and output only PlantUML code without code block."
            + "\n"
            + "<code>"
            + "\n"
            + figure_response
            + "\n\n"
            + "<hint>"
            + check_response
        )

        figure_response = chat_with_gpt(figure_system_prompt, figure_user_prompt)
        print(f"(regenerate {i})figure_response = {figure_response}")

    return figure_response
