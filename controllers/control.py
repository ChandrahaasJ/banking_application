import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from banking_application.models.DB_Schemas import Customer, Account, Base, Address
from dotenv import load_dotenv

load_dotenv(dotenv_path=r"C:\pythonpractice\banking_application\.env")
class Database:
    def __init__(self):
        user=os.getenv("DB_user")
        passw=os.getenv("DB_pass")
        db_url=f"mysql+pymysql://{user}:{passw}@localhost:3306/SaarathiFinance"
        self.engine = create_engine(db_url)
        Base.metadata.create_all(bind=self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def create_user(self, name, city, state, zip_code):
        """Create a new customer with their initial address"""
        try:
            # Start a new transaction
            self.session.begin_nested()
            customer = Customer(name=name)
            self.session.add(customer)
            #self.session.flush()  # This gets us the customer's CRN without committing
            # Commit both customer one transaction
            self.session.commit()
            self.session.begin_nested()
            address = Address(
                crn=customer.crn,
                city=city,
                state=state,
                zip_code=zip_code
            )
            self.session.add(address)
            self.session.commit()
            
            # Verify the address was created
            created_address = self.session.query(Address).filter(Address.crn == customer.crn).first()
            if not created_address:
                raise Exception("Failed to create initial address")
                
            return customer
        except Exception as e:
            self.session.rollback()
            raise e

    def create_account(self, crn, initial_balance=0.0):
        """Create a new account for a customer"""
        try:
            account = Account(
                crn=crn,
                balance=initial_balance
            )
            self.session.add(account)
            self.session.commit()
            return account
        except Exception as e:
            self.session.rollback()
            raise e

    def add_address(self, crn, city, state, zip_code):
        """Add an address for a customer"""
        try:
            address = Address(
                crn=crn,
                city=city,
                state=state,
                zip_code=zip_code
            )
            self.session.add(address)
            self.session.commit()
            return address
        except Exception as e:
            self.session.rollback()
            raise e

    def close(self):
        """Close the database session"""
        self.session.close()

