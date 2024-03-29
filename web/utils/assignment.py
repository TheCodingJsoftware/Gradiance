from typing import Union

from utils.assignment_template import AssignmentTemplate
from utils.letter_grade import get_letter_grade


class Assignment:
    def __init__(self, template: AssignmentTemplate) -> None:
        self.score = 0.0
        self.template = template

    def set_name(self, name):
        self.template.name = name

    def get_name(self) -> str:
        return self.template.name

    def get_worth(self) -> float:
        return self.template.worth

    def to_dict(self) -> dict[str, Union[str, float]]:
        return {
            "name": self.template.name,
            "score": self.score,
            "worth": self.template.worth,
        }

    def from_dict(self, data: dict):
        self.score = float(data["score"])

    def get_percentage(self) -> float:
        try:
            return self.score / self.get_worth() * 100
        except ZeroDivisionError:
            return 0.0

    def get_letter_grade(self) -> str:
        percentage = self.get_percentage()
        return get_letter_grade(percentage)
