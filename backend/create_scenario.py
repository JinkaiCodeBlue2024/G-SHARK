import os
import json

import openai

from regenerate_network_figure import generate_figure_code


openai.api_key = os.getenv("OPENAI_API_KEY")

scenario_system_prompt = (
    "You are a professional in creating cyber-attack exercise scenarios."
    "Please output your responce message in Japanese"
    "Please output your responce message according to the following json format."
    "{"
    '"title": "string",'
    '"background": "string",'
    '"networkFigure": "null",'
    '"situation": ['
    "{"
    '"situationNo": "integer",'
    '"date": "string",'
    '"content": "string",'
    '"issue": "string"'
    "}"
    "]"
    "}"
)

scenario_base_prompt = (
    "We would like to request the creation of a scenario for a role-play style cyber-attack exercise."
    "However, the following conditions must be met."
    "Please include information on intrusion, detection, and attack."
    "The attack scenarios should be based on actual attack cases."
    "Scenarios must be in chronological order. The start date can be any time."
    "Describe the cause of detection, information discovered, and information about the attack as concretely and in as much detail as possible."
    "Please make the scenario as realistic as possible, including terminal names, IP addresses, department names, malware names, etc. "
    "Also, please specify the number of detected terminals and the number of attacking terminals."
    "There are multiple possible detection and attack methods."
    "However, please select a combination that is not unnatural when looking at the scenario as a whole."
    "Include as much technical information as possible."
    "Create the scenario assuming that the attacker fails to defend itself."
    "Also consider the impact on the surrounding environment, excluding the attacked organization."
    "Please describe the issues to be discussed in the issue."
    "Please create at least four situations."
)

figure_system_prompt = (
    "Please output your responce message in plantUML format according to the following format."
    "<format>"
    "@startuml"
    "@enduml"
)

figure_base_prompt = (
    "Create a network diagram based on the following scenario." "Not sequence diagram."
)


def create_prompt(input: str):
    prompt = (
        scenario_base_prompt
        + "\n"
        + "The following information should be used to create the scenario."
        + "\n"
        + input
    )
    return prompt


def chat_with_gpt(system_prompt: str, prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-4-0613",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        temperature=1,
        max_tokens=4096,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    text = response.choices[0]["message"]["content"].strip()
    return text


def create_scenario(input: str):
    scenario_user_prompt = create_prompt(input)
    scenario_response = chat_with_gpt(scenario_system_prompt, scenario_user_prompt)
    print(f"{scenario_response = }")
    scenario = json.loads(scenario_response)

    figure_user_prompt = figure_base_prompt + "\n" + scenario_response
    figure_response = generate_figure_code(figure_system_prompt, figure_user_prompt)
    scenario["networkFigure"] = figure_response
    return scenario
