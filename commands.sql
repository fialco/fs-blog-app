CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (
    author,
    url,
    title
) VALUES (
    'Dr. Gordon Freeman', 'lambdacore.com', 'Basics of Theoretical Physics'
);

INSERT INTO blogs (
    author,
    url,
    title
) VALUES (
    'Dr. Casper Darling',
    'room665.com',
    'My Interpretation of Many Worlds'
);
