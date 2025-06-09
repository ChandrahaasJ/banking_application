from pydantic import BaseModel

class User(BaseModel):
    name:str
    city:str
    state:str
    zip_code:str

class Account(BaseModel):
    crn: int
    balance:float