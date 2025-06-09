from typing import List, Optional
from datetime import datetime
from .DB_Schemas import Customer, Account, Address
from .database_singleton import DatabaseSingleton

class BaseRepository:
    def __init__(self):
        self.db = DatabaseSingleton()

class CustomerRepository(BaseRepository):
    def create(self, name: str, city: str, state: str, zip_code: str) -> Customer:
        customer = Customer(name=name)
        self.db.session.add(customer)
        self.db.session.flush()
        
        # Create initial address
        address = Address(
            city=city,
            state=state,
            zip_code=zip_code,
            crn=customer.crn
        )
        self.db.session.add(address)
        self.db.session.commit()
        return customer

    def get_by_crn(self, crn: int) -> Optional[Customer]:
        return self.db.session.query(Customer).filter(Customer.crn == crn).first()

class AccountRepository(BaseRepository):
    def create(self, crn: int, initial_balance: float = 0.0) -> Account:
        account = Account(crn=crn, balance=initial_balance)
        self.db.session.add(account)
        self.db.session.commit()
        return account

    def get_by_account_number(self, account_number: int) -> Optional[Account]:
        return self.db.session.query(Account).filter(Account.account_number == account_number).first()

    def get_by_crn(self, crn: int) -> List[Account]:
        return self.db.session.query(Account).filter(Account.crn == crn).all()

    def update_balance(self, account_number: int, new_balance: float) -> Account:
        account = self.get_by_account_number(account_number)
        if account:
            account.balance = new_balance
            account.last_updated = datetime.utcnow()
            self.db.session.commit()
        return account

class AddressRepository(BaseRepository):
    def create(self, crn: int, city: str, state: str, zip_code: str) -> Address:
        address = Address(crn=crn, city=city, state=state, zip_code=zip_code)
        self.db.session.add(address)
        self.db.session.commit()
        return address

    def get_by_crn(self, crn: int) -> List[Address]:
        return self.db.session.query(Address).filter(Address.crn == crn).all() 