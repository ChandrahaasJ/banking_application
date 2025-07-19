from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from banking_application.controllers.control import Database
from banking_application.models.DB_Schemas import Account, Address
#testing
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

db = Database()

# Pydantic models for request validation
class UserCreate(BaseModel):
    name: str
    city: str
    state: str
    zip_code: str

class AddressCreate(BaseModel):
    crn: int
    city: str
    state: str
    zip_code: str

class AccountCreate(BaseModel):
    crn: int
    initial_balance: float = 0.0

class BalanceUpdate(BaseModel):
    account_number: str
    new_balance: float

@app.post("/create_user")
async def create_user(user: UserCreate):
    try:
        print(f"Received user data: {user.dict()}")  # Log the received data
        customer = db.create_user(
            name=user.name,
            city=user.city,
            state=user.state,
            zip_code=user.zip_code
        )
        # Verify the address was created
        address = db.session.query(Address).filter(Address.crn == customer.crn).first()
        if not address:
            raise HTTPException(status_code=500, detail="Failed to create initial address")
            
        return {
            "message": "User created successfully", 
            "crn": customer.crn,
            "address": {
                "city": address.city,
                "state": address.state,
                "zip_code": address.zip_code
            }
        }
    except Exception as e:
        print(f"Error creating user: {str(e)}")  # Log the error
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/add_address")
async def add_address(address: AddressCreate):
    try:
        address_obj = db.add_address(
            crn=address.crn,
            city=address.city,
            state=address.state,
            zip_code=address.zip_code
        )
        return {"message": "Address added successfully", "address_id": address_obj.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/add_account")
async def add_account(account: AccountCreate):
    try:
        account_obj = db.create_account(
            crn=account.crn,
            initial_balance=account.initial_balance
        )
        return {"message": "Account created successfully", "account_number": account_obj.account_number}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/update_balance")
async def update_balance(balance_update: BalanceUpdate):
    try:
        # First, get the account
        account = db.session.query(Account).filter(Account.account_number == balance_update.account_number).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Update the balance
        account.balance = balance_update.new_balance
        db.session.commit()
        
        return {"message": "Balance updated successfully", "new_balance": account.balance}
    except Exception as e:
        db.session.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/customer/{crn}/accounts", response_model=List[dict])
async def get_customer_accounts(crn: int):
    try:
        accounts = db.session.query(Account).filter(Account.crn == crn).all()
        if not accounts:
            raise HTTPException(status_code=404, detail="No accounts found for this customer")
        
        return [
            {
                "account_number": account.account_number,
                "balance": account.balance,
                "created_at": account.created_at,
                "last_updated": account.last_updated
            }
            for account in accounts
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/account/{account_number}/balance")
async def get_account_balance(account_number: int):
    try:
        account = db.session.query(Account).filter(Account.account_number == account_number).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
        
        return {
            "account_number": account.account_number,
            "balance": account.balance,
            "last_updated": account.last_updated
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Cleanup when the application shuts down
# @app.on_event("shutdown")
# async def shutdown_event():
#     db.close()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(app, host="0.0.0.0", port=8000)