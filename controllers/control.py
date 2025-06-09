import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from banking_application.models.DB_Schemas import Customer,Account,Base,Address

Base.meta