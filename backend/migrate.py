import os
from sqlalchemy import create_engine, MetaData, Table
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, connect_args={"ssl": {"ca": None}})
metadata = MetaData()

def drop_collaboration_table():
    try:
        table_name = "collaboration_requests"
        table = Table(table_name, metadata, autoload_with=engine)
        print(f"Dropping table {table_name}...")
        table.drop(engine)
        print("Table dropped successfully.")
    except Exception as e:
        print(f"Error dropping table: {e}")

if __name__ == "__main__":
    drop_collaboration_table()
