from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, StrictStr, field_validator, model_validator


def _validate_title(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    if not value:
        raise ValueError("title is required and must not be blank")
    if len(value) > 200:
        raise ValueError("title must be at most 200 characters")
    return value


class TaskCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: StrictStr
    description: StrictStr = Field(default="", max_length=2000)
    priority: str = "5"
    dueDate: Optional[str] = None
    status: Literal["open", "done"] = "open"

    _title = field_validator("title")(_validate_title)


class TaskUpdate(BaseModel):
    """All fields optional - only fields present in the request are changed."""

    model_config = ConfigDict(extra="ignore")

    title: Optional[StrictStr] = None
    description: Optional[StrictStr] = Field(default=None, max_length=2000)
    priority: Optional[str] = None
    dueDate: Optional[str] = None
    status: Optional[Literal["open", "done"]] = None

    _title = field_validator("title")(_validate_title)

    @model_validator(mode="after")
    def _no_null_for_required_fields(self):
        # dueDate may be set to null explicitly, the other fields not
        for name in ("title", "description", "priority", "status"):
            if name in self.model_fields_set and getattr(self, name) is None:
                raise ValueError(f"{name} must not be null")
        return self
