from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()
 
class Customer(Base):
    __tablename__ = "customers"

    crn = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    #account_number = Column(String(20), unique=True, nullable=False)
    address = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with Account
    account = relationship("Account", back_populates="customer", uselist=False)
    # Relationship with Address
    addresses = relationship("Address", back_populates="customer")

    def __repr__(self):
        return f"<Customer(name='{self.name}', account_number='{self.account_number}')>"

class Account(Base):
    __tablename__ = "accounts"

    account_number = Column(String(20), primary_key=True, autoincrement=True)
    crn = Column(String(20), ForeignKey('customers.crn'), unique=True, nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with Customer
    customer = relationship("Customer", back_populates="account")

    def __repr__(self):
        return f"<Account(account_number='{self.account_number}', balance={self.balance})>" 
    
class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(10), nullable=False)
    crn = Column(Integer, ForeignKey('customers.crn'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with Customer
    customer = relationship("Customer", back_populates="addresses")

    def __repr__(self):
        return f"<Address(city='{self.city}', state='{self.state}', zip_code='{self.zip_code}')>"