#!/usr/bin/env python3
"""
Production-Grade MongoDB Seeding Script for MERN Marketplace System

Handles: users, jobs, forumGroups, posts with proper schema compliance,
relationship resolution, and referential integrity.

Usage:
    python generate.py [--seed固定值] [--users数量] [--jobs数量] [--posts数量] [--clear-only]
"""

import argparse
import random
import sys
from datetime import datetime, timedelta
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import BulkWriteError, DuplicateKeyError

# Default seeding
#python generate.py

# Deterministic output
#python generate.py --seed 42

# Custom counts
#python generate.py --users 50 --jobs 100 --posts 80

# Clear only
#python generate.py --clear-only

# =========================
# CONFIGURATION
# =========================
MONGO_URI = "mongodb+srv://admin:Rd0tQKtKmW1e8Fmy@mern.uvk4e9f.mongodb.net/"
DB_NAME = "database"

# Seeding counts
DEFAULT_USERS = 30
DEFAULT_JOBS = 50
DEFAULT_POSTS = 40

# Deterministic mode (set to integer for reproducible data)
RANDOM_SEED = None  # Set to e.g., 42 for deterministic output

# =========================
# DATA CONSTANTS
# =========================
FIRST_NAMES = [
    "James", "Maria", "Chen", "Sarah", "Michael", "Fatima", "David",
    "Aisha", "Carlos", "Wei", "Emma", "Ahmed", "Luis", "Yuki", "Olivia",
    "Raj", "Sofia", "Lucas", "Priya", "Omar", "Isabella", "Hassan",
    "Elena", "Mateo", "Nadia", "Andre", " Mei", "Daniel", "Zara"
]

LAST_NAMES = [
    "Smith", "Garcia", "Patel", "Kim", "Nguyen", "Chen", "Ali",
    "Rodriguez", "Wang", "Lee", "Kumar", "Brown", "Johnson", "Williams",
    "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore"
]

SKILLS = [
    "JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS",
    "Docker", "UI/UX", "Figma", "HTML/CSS", "TypeScript", "PostgreSQL",
    "GraphQL", "Kubernetes", "React Native", "Flutter", "Swift",
    "TensorFlow", "PyTorch", "Data Analysis", "Machine Learning"
]

LOCATIONS = [
    ("New York", "NY"),
    ("Los Angeles", "CA"),
    ("San Francisco", "CA"),
    ("Chicago", "IL"),
    ("Austin", "TX"),
    ("Seattle", "WA"),
    ("Boston", "MA"),
    ("Denver", "CO"),
    ("Miami", "FL"),
    ("Remote", None)
]

JOB_CATEGORIES = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Content Writing",
    "SEO",
    "Video Editing",
    "Virtual Assistant",
    "Database Administration",
    "DevOps"
]

JOB_TITLES = {
    "Web Development": [
        "Full-Stack Developer Needed",
        "React Frontend Developer",
        "Node.js Backend API Developer",
        "E-commerce Website Developer",
        "Landing Page Developer"
    ],
    "Mobile Development": [
        "iOS App Developer",
        "Android App Developer",
        "Cross-Platform Mobile Developer",
        "React Native Developer",
        "Mobile App UI Specialist"
    ],
    "UI/UX Design": [
        "UI Designer for Web App",
        "UX Research and Design",
        "Mobile App Design",
        "Brand Identity Design",
        "UI/UX Audit"
    ],
    "Data Science": [
        "Data Analyst for Analytics Dashboard",
        "Machine Learning Model Developer",
        "Data Pipeline Engineer",
        "Business Intelligence Report",
        "Predictive Analytics Implementation"
    ],
    "Content Writing": [
        "Technical Writer for Documentation",
        "Blog Content Creator",
        "SEO Content Writer",
        "Copywriter for Landing Pages",
        "Product Description Writer"
    ],
    "SEO": [
        "SEO Specialist for WordPress",
        "Technical SEO Audit",
        "Local SEO Optimization",
        "E-commerce SEO Expert",
        "SEO Content Strategy"
    ],
    "Video Editing": [
        "Video Editor for YouTube",
        "Social Media Video Editor",
        "Promo Video Creator",
        "Motion Graphics Designer",
        "Video Post-Production"
    ],
    "Virtual Assistant": [
        "Administrative VA",
        "Customer Support VA",
        "Research Assistant",
        "Data Entry Specialist",
        "Calendar Management VA"
    ],
    "Database Administration": [
        "MongoDB DBA",
        "PostgreSQL Database Optimizer",
        "Database Migration Specialist",
        "SQL Query Optimization",
        "Database Security Audit"
    ],
    "DevOps": [
        "CI/CD Pipeline Setup",
        "Docker Containerization",
        "AWS Infrastructure Setup",
        "Kubernetes Cluster Management",
        "DevOps Consultant"
    ]
}

FORUM_GROUPS = [
    ("Web Development", "Discussions about web development frameworks, APIs, and best practices"),
    ("Mobile Development", "iOS, Android, and cross-platform mobile app development"),
    ("Design & UX", "User interface design, user experience, and prototyping"),
    ("Data Science", "Machine learning, data analysis, and AI topics"),
    ("Career Advice", "Freelance career tips, client management, and growth strategies"),
    ("Freelancing", "General freelancing discussions, pricing, and finding clients"),
    ("Tech Talk", "General technology discussions and news"),
    ("Showcase", "Share your completed projects and get feedback")
]

POST_TITLES = [
    "Need help with React state management",
    "Best backend architecture for scaling?",
    "How to land first freelance client?",
    "MongoDB schema design question",
    "UI/UX feedback needed",
    "React vs Vue - which to choose?",
    "How do you handle difficult clients?",
    "Best platforms for finding remote work?",
    "Rate negotiation tips for beginners",
    "Portfolio website feedback",
    "JavaScript performance optimization",
    "Database indexing strategies",
    "API design best practices",
    "Freelance tax tips for US-based",
    "Time management as freelancer"
]

POST_CONTENTS = [
    "I'm working on a project and ran into some issues. Has anyone dealt with this before? Looking for advice from experienced developers.",
    "Just finished my first freelance project and would love some feedback on the code structure. What are best practices I should follow?",
    "Been freelancing for 6 months now but struggling to find consistent clients. Any tips for building a reliable client base?",
    "Starting a new project and need advice on technology choices. The requirements are... what would you recommend?",
    "Looking for feedback on my portfolio website. Does it look professional enough to attract high-paying clients?",
    "Had a great client experience and wanted to share what worked well. Communication was key!",
    "Anyone have experience with this specific technology? Need some guidance on getting started.",
    "Is my rate too low? Been charging $X but not sure if I should raise prices. Thoughts?",
    "Just completed my 50th project! Here's what I've learned about client management.",
    "Need recommendations for tools that help with project management and time tracking."
]

COMMENT_TEXTS = [
    "Great post! Thanks for sharing.",
    "I had a similar experience. What worked for me was...",
    "Have you tried looking at it from a different angle?",
    "Can you share more details about your approach?",
    "This is really helpful, thanks for posting!",
    "I've been in this situation before. My advice would be to...",
    "Interesting perspective. Have you considered...",
    "Thanks for the detailed explanation!",
    "I agree with this approach.",
    "Would love to hear more about your experience."
]

# =========================
# UTILITY FUNCTIONS
# =========================

def generate_object_id() -> str:
    """Generate a MongoDB-compatible ObjectId."""
    return ObjectId()


def generate_username(first: str, last: str, unique_suffix: int) -> str:
    """Generate unique username/handle."""
    return f"{first.lower()}_{last.lower()}{unique_suffix}"


def simulate_password_hash(plain: str = "password123") -> str:
    """
    Simulate a bcrypt hash.
    In production, use proper bcrypt hashing with bcrypt library.
    This generates a consistent hash representation for testing.
    """
    # Simple simulation - in production use bcrypt.hashpw()
    return f"$2b$12${plain[:22].ljust(22, 'X')}"


def random_datetime(start_days_ago: int = 365, end_days_ago: int = 0) -> datetime:
    """Generate random datetime within a range."""
    if RANDOM_SEED:
        random.seed(RANDOM_SEED)
    end = datetime.now() - timedelta(days=end_days_ago)
    start = datetime.now() - timedelta(days=start_days_ago)
    delta = end - start
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=random_seconds)


def weighted_choice(choices: list, weights: list) -> any:
    """Select from choices with weighted probability."""
    return random.choices(choices, weights=weights, k=1)[0]


# =========================
# SCHEMA DEFINITIONS
# =========================

class UserSchema:
    """User document schema factory."""

    @staticmethod
    def create(
        name: str,
        email: str,
        username: str,
        password_hash: str,
        skills: list,
        location: tuple,
        bio: str = None,
        profile_image: str = None,
        is_remote: bool = False,
        level: int = 1,
        xp: int = 0
    ) -> dict:
        """Create a user document matching User.js schema."""
        city, state = location
        return {
            "_id": generate_object_id(),
            "name": name,
            "email": email,
            "username": username,
            "password": password_hash,
            "phone": f"+1{random.randint(2000000000, 9999999999)}",
            "location": f"{city}, {state}" if state else city,
            "remoteAvailability": is_remote,
            "skills": skills,
            "languages": ["English"],
            "certifications": [],
            "profileImage": profile_image or f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=random",
            "xp": xp,
            "level": level,
            "jobStats": {
                "jobsApplied": random.randint(0, 20),
                "jobsCompleted": random.randint(0, 15),
                "jobsHired": random.randint(0, 10)
            },
            "communityStats": {
                "posts": random.randint(0, 10),
                "comments": random.randint(0, 30)
            },
            "profileCompleted": True,
            "lastActiveAt": datetime.now(),
            "streakCount": random.randint(0, 14),
            "role": "user",
            "kycStatus": random.choice(["unverified", "pending", "verified"]),
            "documents": []
        }

    @staticmethod
    def validate(doc: dict) -> list:
        """Validate user document. Returns list of error messages."""
        errors = []
        required_fields = ["name", "email", "password", "username"]
        for field in required_fields:
            if field not in doc or not doc[field]:
                errors.append(f"Missing required field: {field}")
        if "@" not in (doc.get("email", "")):
            errors.append("Invalid email format")
        return errors


class JobSchema:
    """Job document schema factory."""

    CATEGORIES = JOB_CATEGORIES

    @staticmethod
    def create(
        title: str,
        description: str,
        price: int,
        category: str,
        created_by_id: str,
        assigned_to_id: str = None,
        candidates: list = None,
        status: str = "open",
        location: tuple = None,
        tags: list = None,
        created_at: datetime = None
    ) -> dict:
        """Create a job document matching Job.js schema."""
        city, state = location or random.choice(LOCATIONS)
        location_type = "remote" if state is None else "physical"

        doc = {
            "_id": generate_object_id(),
            "title": title,
            "description": description,
            "price": price,
            "currency": "USD",
            "category": category,
            "location": {
                "type": location_type,
                "address": f"{city}, {state}" if state else "Remote",
                "coordinates": None
            },
            "dateListed": created_at or datetime.now(),
            "createdBy": created_by_id,
            "assignedTo": assigned_to_id,
            "candidates": candidates or [],
            "rejectedCandidates": [],
            "status": status
        }

        if tags:
            doc["tags"] = tags

        return doc

    @staticmethod
    def validate(doc: dict, user_ids: list) -> list:
        """Validate job document. Returns list of error messages."""
        errors = []
        required_fields = ["title", "description", "price", "category", "createdBy"]
        for field in required_fields:
            if field not in doc or not doc[field]:
                errors.append(f"Missing required field: {field}")

        # Validate createdBy is valid ObjectId reference
        if doc.get("createdBy") and str(doc["createdBy"]) not in user_ids:
            errors.append(f"Invalid createdBy reference: {doc['createdBy']}")

        # Validate assignedTo if present
        if doc.get("assignedTo") and str(doc["assignedTo"]) not in user_ids:
            errors.append(f"Invalid assignedTo reference: {doc['assignedTo']}")

        # Validate candidates
        for candidate_id in doc.get("candidates", []):
            if str(candidate_id) not in user_ids:
                errors.append(f"Invalid candidate reference: {candidate_id}")

        return errors


class ForumGroupSchema:
    """ForumGroup document schema factory."""

    @staticmethod
    def create(
        name: str,
        description: str,
        created_by_id: str
    ) -> dict:
        """Create a forum group document matching ForumGroup.js schema."""
        return {
            "_id": generate_object_id(),
            "name": name,
            "description": description,
            "createdBy": created_by_id
        }

    @staticmethod
    def validate(doc: dict, user_ids: list) -> list:
        """Validate forum group document."""
        errors = []
        if not doc.get("name"):
            errors.append("Missing required field: name")
        if not doc.get("createdBy"):
            errors.append("Missing required field: createdBy")
        elif str(doc["createdBy"]) not in user_ids:
            errors.append(f"Invalid createdBy reference: {doc['createdBy']}")
        return errors


class PostSchema:
    """Post document schema factory."""

    @staticmethod
    def create(
        content: str,
        created_by_id: str,
        group_id: str = None,
        post_type: str = "post",
        category: str = None,
        title: str = None,
        created_at: datetime = None,
        include_comments: bool = True,
        user_ids: list = None
    ) -> dict:
        """Create a post document matching Post.js schema."""
        doc = {
            "_id": generate_object_id(),
            "content": content,
            "media": [],
            "likes": [],
            "comments": [],
            "shareCount": 0,
            "sharedFrom": None,
            "createdBy": created_by_id,
            "type": post_type,
            "category": category,
            "groupId": group_id,
            "pinned": False,
            "createdAt": created_at or datetime.now()
        }

        # Add title for thread type posts
        if title:
            doc["title"] = title

        # Optionally generate comments
        if include_comments and user_ids:
            num_comments = random.randint(0, 8)
            for _ in range(num_comments):
                doc["comments"].append({
                    "user": random.choice(user_ids),
                    "text": random.choice(COMMENT_TEXTS),
                    "createdAt": datetime.now() - timedelta(hours=random.randint(1, 72))
                })

            # Add some random likes
            potential_likers = [uid for uid in user_ids if uid != str(created_by_id)]
            num_likes = random.randint(0, min(10, len(potential_likers)))
            doc["likes"] = random.sample(potential_likers, num_likes) if num_likes > 0 else []

        return doc

    @staticmethod
    def validate(doc: dict, user_ids: list, group_ids: list = None) -> list:
        """Validate post document."""
        errors = []
        if not doc.get("content"):
            errors.append("Missing required field: content")
        if not doc.get("createdBy"):
            errors.append("Missing required field: createdBy")
        elif str(doc["createdBy"]) not in user_ids:
            errors.append(f"Invalid createdBy reference: {doc['createdBy']}")

        # Validate comments reference valid users
        for comment in doc.get("comments", []):
            if str(comment.get("user")) not in user_ids:
                errors.append(f"Invalid comment user reference")

        # Validate likes reference valid users
        for like in doc.get("likes", []):
            if str(like) not in user_ids:
                errors.append(f"Invalid like user reference")

        # Validate groupId if present
        if group_ids and doc.get("groupId") and str(doc["groupId"]) not in group_ids:
            errors.append(f"Invalid groupId reference")

        return errors


# =========================
# VALIDATION LAYER
# =========================

class ValidationError(Exception):
    """Raised when validation fails."""
    pass


def validate_all_documents(users: list, jobs: list, groups: list, posts: list, user_ids: list):
    """Validate all documents before insertion."""
    user_ids_set = set(user_ids)
    group_ids = [str(g["_id"]) for g in groups]

    errors_found = []

    # Validate users
    for user in users:
        errors = UserSchema.validate(user)
        if errors:
            errors_found.extend([f"User {user.get('name')}: {e}" for e in errors])

    # Validate jobs
    for job in jobs:
        errors = JobSchema.validate(job, user_ids_set)
        if errors:
            errors_found.extend([f"Job {job.get('title')}: {e}" for e in errors])

    # Validate groups
    for group in groups:
        errors = ForumGroupSchema.validate(group, user_ids_set)
        if errors:
            errors_found.extend([f"Group {group.get('name')}: {e}" for e in errors])

    # Validate posts
    for post in posts:
        errors = PostSchema.validate(post, user_ids_set, group_ids)
        if errors:
            errors_found.extend([f"Post: {e}" for e in errors])

    if errors_found:
        raise ValidationError(f"Validation failed:\n" + "\n".join(errors_found))


# =========================
# DATA GENERATION FACTORIES
# =========================

class UserFactory:
    """Factory for generating user documents."""

    def __init__(self):
        self.emails_used = set()
        self.usernames_used = set()

    def generate(self, count: int) -> list:
        """Generate user documents."""
        users = []

        for i in range(count):
            # Generate unique name
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            unique_suffix = i + 1

            # Ensure unique email
            email = f"{first.lower()}.{last.lower()}{unique_suffix}@mail.com"
            while email in self.emails_used:
                unique_suffix += 1
                email = f"{first.lower()}.{last.lower()}{unique_suffix}@mail.com"
            self.emails_used.add(email)

            # Ensure unique username
            username = generate_username(first, last, unique_suffix)
            while username in self.usernames_used:
                unique_suffix += 1
                username = generate_username(first, last, unique_suffix)
            self.usernames_used.add(username)

            name = f"{first} {last}"
            skills = random.sample(SKILLS, random.randint(3, 7))
            location = random.choice(LOCATIONS)
            is_remote = location[1] is None

            # Calculate level from XP
            xp = random.randint(0, 3000)
            level = max(1, xp // 300 + 1)

            user = UserSchema.create(
                name=name,
                email=email,
                username=username,
                password_hash=simulate_password_hash(),
                skills=skills,
                location=location,
                is_remote=is_remote,
                level=level,
                xp=xp
            )
            users.append(user)

        return users


class JobFactory:
    """Factory for generating job documents."""

    def generate(
        self,
        users: list,
        count: int,
        created_after: datetime = None
    ) -> list:
        """Generate job documents."""
        jobs = []
        user_ids = [str(u["_id"]) for u in users]

        for i in range(count):
            creator_idx = random.randint(0, len(users) - 1)
            created_by_id = users[creator_idx]["_id"]

            category = random.choice(JOB_CATEGORIES)
            title = random.choice(JOB_TITLES.get(category, JOB_TITLES["Web Development"]))

            # Create somewhat realistic description
            description = f"Looking for a skilled {category} specialist for an ongoing project. "
            description += f"Required skills: {', '.join(random.sample(SKILLS, 3))}. "
            description += "Please provide examples of your previous work."
            description = description[:450]  # Max length 500

            price = random.randint(100, 8000)

            # Determine status with weighted distribution
            status = weighted_choice(
                ["open", "in-progress", "completed"],
                [0.6, 0.3, 0.1]
            )

            # Some jobs get assigned
            assigned_to_id = None
            if status in ["in-progress", "completed"]:
                assigned_to_id = random.choice(user_ids)

            # Some jobs get candidates
            candidates = []
            if status == "open" or random.random() < 0.5:
                num_candidates = random.randint(0, 5)
                candidates = random.sample(user_ids, num_candidates)

            # Location and tags
            location = random.choice(LOCATIONS)
            tags = random.sample(SKILLS, random.randint(2, 5))

            # Stagger creation dates
            if created_after:
                created_at = created_after + timedelta(hours=random.randint(1, 168))
            else:
                created_at = random_datetime(start_days_ago=180, end_days_ago=1)

            job = JobSchema.create(
                title=title,
                description=description,
                price=price,
                category=category,
                created_by_id=created_by_id,
                assigned_to_id=assigned_to_id,
                candidates=candidates,
                status=status,
                location=location,
                tags=tags,
                created_at=created_at
            )
            jobs.append(job)

        return jobs


class ForumGroupFactory:
    """Factory for generating forum group documents."""

    def generate(self, users: list) -> list:
        """Generate forum group documents."""
        groups = []
        user_ids = [str(u["_id"]) for u in users]

        for name, description in FORUM_GROUPS:
            created_by_id = random.choice(user_ids)
            group = ForumGroupSchema.create(
                name=name,
                description=description,
                created_by_id=created_by_id
            )
            groups.append(group)

        return groups


class PostFactory:
    """Factory for generating post documents."""

    def generate(
        self,
        users: list,
        groups: list,
        count: int,
        created_after: datetime = None
    ) -> list:
        """Generate post documents."""
        posts = []
        user_ids = [str(u["_id"]) for u in users]
        group_ids = [str(g["_id"]) for g in groups]

        num_threads = count // 3  # ~1/3 threads
        num_regular_posts = count - num_threads

        # Generate thread posts
        for i in range(num_threads):
            creator_idx = random.randint(0, len(users) - 1)
            created_by_id = users[creator_idx]["_id"]

            group_id = random.choice(group_ids)
            title = random.choice(POST_TITLES)
            content = random.choice(POST_CONTENTS)

            if created_after:
                created_at = created_after + timedelta(hours=random.randint(1, 72))
            else:
                created_at = random_datetime(start_days_ago=90, end_days_ago=1)

            post = PostSchema.create(
                content=content,
                created_by_id=created_by_id,
                group_id=group_id,
                post_type="thread",
                category=random.choice(JOB_CATEGORIES),
                title=title,
                created_at=created_at,
                include_comments=True,
                user_ids=user_ids
            )
            posts.append(post)

        # Generate regular posts
        for i in range(num_regular_posts):
            creator_idx = random.randint(0, len(users) - 1)
            created_by_id = users[creator_idx]["_id"]

            group_id = None  # Regular posts may not belong to a group
            content = random.choice(POST_CONTENTS)

            if created_after:
                created_at = created_after + timedelta(hours=random.randint(1, 72))
            else:
                created_at = random_datetime(start_days_ago=90, end_days_ago=1)

            post = PostSchema.create(
                content=content,
                created_by_id=created_by_id,
                group_id=group_id,
                post_type="post",
                created_at=created_at,
                include_comments=True,
                user_ids=user_ids
            )
            posts.append(post)

        return posts


# =========================
# DATABASE OPERATIONS
# =========================

def clear_collections(users_col, jobs_col, groups_col, posts_col):
    """Clear existing test data."""
    print("Clearing existing collections...")
    users_col.delete_many({})
    jobs_col.delete_many({})
    groups_col.delete_many({})
    posts_col.delete_many({})
    print("Collections cleared.")


def bulk_insert_safe(collection, docs: list, name: str) -> int:
    """Insert documents with error handling."""
    if not docs:
        print(f"No {name} to insert.")
        return 0

    try:
        result = collection.insert_many(docs, ordered=False)
        print(f"Inserted {len(result.inserted_ids)} {name}")
        return len(result.inserted_ids)
    except BulkWriteError as e:
        print(f"Bulk insert error for {name}: {e}")
        # Try individual inserts for non-duplicate errors
        inserted = 0
        for doc in docs:
            try:
                collection.insert_one(doc)
                inserted += 1
            except DuplicateKeyError:
                pass
        print(f"Inserted {inserted} {name} (with fallback)")
        return inserted


# =========================
# MAIN PIPELINE
# =========================

def seed_database(
    num_users: int = DEFAULT_USERS,
    num_jobs: int = DEFAULT_JOBS,
    num_posts: int = DEFAULT_POSTS,
    clear_only: bool = False
):
    """Main seeding pipeline."""

    # Initialize random seed for reproducibility
    if RANDOM_SEED:
        random.seed(RANDOM_SEED)

    # Connect to MongoDB
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB: {e}")
        sys.exit(1)

    db = client[DB_NAME]
    users_col = db["users"]
    jobs_col = db["jobs"]
    groups_col = db["forumGroups"]
    posts_col = db["posts"]

    print(f"Using database: {DB_NAME}")

    # Clear existing data
    clear_collections(users_col, jobs_col, groups_col, posts_col)

    if clear_only:
        print("Clear-only mode: exiting after clearing.")
        client.close()
        return

    # Generate data
    print(f"\nGenerating data...")
    print(f"  - {num_users} users")
    print(f"  - {num_jobs} jobs")
    print(f"  - {len(FORUM_GROUPS)} forum groups")
    print(f"  - {num_posts} posts")

    # User Factory
    user_factory = UserFactory()
    users = user_factory.generate(num_users)
    print(f"Generated {len(users)} users")

    # Job Factory
    job_factory = JobFactory()
    jobs = job_factory.generate(users, num_jobs)
    print(f"Generated {len(jobs)} jobs")

    # Forum Group Factory
    group_factory = ForumGroupFactory()
    groups = group_factory.generate(users)
    print(f"Generated {len(groups)} forum groups")

    # Post Factory
    post_factory = PostFactory()
    posts = post_factory.generate(users, groups, num_posts)
    print(f"Generated {len(posts)} posts")

    # Get all user IDs for validation
    user_ids = [str(u["_id"]) for u in users]

    # Validate all documents
    print("\nValidating documents...")
    try:
        validate_all_documents(users, jobs, groups, posts, user_ids)
        print("All documents validated successfully!")
    except ValidationError as e:
        print(f"VALIDATION ERROR: {e}")
        client.close()
        sys.exit(1)

    # Insert in dependency order
    print("\nInserting data...")
    print("=" * 40)
    print("Order: users -> groups -> jobs -> posts")
    print("=" * 40)

    users_inserted = bulk_insert_safe(users_col, users, "users")
    groups_inserted = bulk_insert_safe(groups_col, groups, "forum groups")
    jobs_inserted = bulk_insert_safe(jobs_col, jobs, "jobs")
    posts_inserted = bulk_insert_safe(posts_col, posts, "posts")

    # Summary
    print("\n" + "=" * 40)
    print("SEEDING COMPLETE")
    print("=" * 40)
    print(f"Users:          {users_inserted}")
    print(f"Jobs:           {jobs_inserted}")
    print(f"Forum Groups:   {groups_inserted}")
    print(f"Posts:          {posts_inserted}")
    print(f"Total:          {users_inserted + jobs_inserted + groups_inserted + posts_inserted}")

    client.close()
    print("\nMongoDB connection closed.")


# =========================
# ENTRY POINT
# =========================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Production-grade MongoDB seeder for MERN marketplace"
    )
    parser.add_argument(
        "--seed", type=int, default=None,
        help="Random seed for deterministic output (e.g., 42)"
    )
    parser.add_argument(
        "--users", type=int, default=DEFAULT_USERS,
        help=f"Number of users to generate (default: {DEFAULT_USERS})"
    )
    parser.add_argument(
        "--jobs", type=int, default=DEFAULT_JOBS,
        help=f"Number of jobs to generate (default: {DEFAULT_JOBS})"
    )
    parser.add_argument(
        "--posts", type=int, default=DEFAULT_POSTS,
        help=f"Number of posts to generate (default: {DEFAULT_POSTS})"
    )
    parser.add_argument(
        "--clear-only", action="store_true",
        help="Clear collections and exit without seeding"
    )

    args = parser.parse_args()

    # Set random seed if provided
    if args.seed:
        RANDOM_SEED = args.seed
        random.seed(RANDOM_SEED)
        print(f"Using deterministic seed: {RANDOM_SEED}")

    # Run seeding
    seed_database(
        num_users=args.users,
        num_jobs=args.jobs,
        num_posts=args.posts,
        clear_only=args.clear_only
    )