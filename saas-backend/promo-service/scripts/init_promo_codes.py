"""Initialize promo codes - Creates free2026 promo code for 2026"""

import sys
import os
from datetime import date
from pathlib import Path

# Add parent directories to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "shared-libs"))
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.db_models import PromoCode, Base
from app.config import settings

# Database setup
engine = create_engine(settings.POSTGRES_URI)
SessionLocal = sessionmaker(bind=engine)

def init_promo_codes():
    """Initialize promo codes"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if free2026 already exists
        existing = db.query(PromoCode).filter(PromoCode.code == "FREE2026").first()
        if existing:
            print("✅ Promo code FREE2026 already exists")
            return
        
        # Create free2026 promo code
        # Valid for entire year 2026
        promo = PromoCode(
            code="FREE2026",
            description="One year free service - Valid for 2026 only",
            discount_type="free_trial",
            free_trial_days=365,  # One year
            valid_from=date(2026, 1, 1),
            valid_until=date(2026, 12, 31),
            max_uses=None,  # Unlimited uses
            current_uses=0,
            is_active=True
        )
        
        db.add(promo)
        db.commit()
        
        print("✅ Promo code FREE2026 created successfully")
        print(f"   Valid from: {promo.valid_from}")
        print(f"   Valid until: {promo.valid_until}")
        print(f"   Free trial days: {promo.free_trial_days}")
        
    except Exception as e:
        print(f"❌ Error creating promo code: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_promo_codes()
