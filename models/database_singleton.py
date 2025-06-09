from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base

class DatabaseSingleton:
    _instance = None
    _engine = None
    _session_factory = None
    _Session = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseSingleton, cls).__new__(cls)
            cls._initialize()
        return cls._instance

    @classmethod
    def _initialize(cls):
        if cls._engine is None:
            # Replace with your actual database URL
            DATABASE_URL = "sqlite:///banking.db"
            cls._engine = create_engine(DATABASE_URL)
            cls._session_factory = sessionmaker(bind=cls._engine)
            cls._Session = scoped_session(cls._session_factory)

    @property
    def session(self):
        return self._Session()

    def close(self):
        if self._Session:
            self._Session.remove()
        if self._engine:
            self._engine.dispose()

    def __del__(self):
        self.close() 