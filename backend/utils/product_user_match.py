DEMO_ONLY_KEYWORDS = ["manele", "rock", "pop", "hip-hop", "jazz", "classical", "electronic", "country", "reggae",
                      "blues", "metal", "folk", "disco", "punk", "soul", "funk", "R&B", "alternative", "indie", "dance",
                      "opera", "DnB", "$uicideboy$", "Joji", "Radiohead", "The 1975", "Pastel Ghost",
                      "Chase and Status", "The Prophet", "The xx", "Black Sun Empire", "Poppy", "The Beatles",
                      "Beyoncé", "Eminem", "Miles Davis", "Ludwig van Beethoven", "Taylor Swift", "Bob Marley",
                      "Nirvana", "Metallica", "Elvis Presley", "Adele", "Kanye West", "Madonna", "David Bowie",
                      "Led Zeppelin", "Queen", "Rihanna", "Drake", "Coldplay", "Pink Floyd", "Billie Eilish",
                      "Ed Sheeran", "Ariana Grande", "Jay-Z", "Bruce Springsteen", "Johnny Cash", "Aretha Franklin",
                      "Prince", "Elton John", "Frank Sinatra", "John Legend", "Katy Perry", "Bruno Mars",
                      "Kendrick Lamar", "U2", "The Rolling Stones", "Justin Bieber", "Shakira", "Whitney Houston",
                      "Bohemian Rhapsody", "Halo", "Lose Yourself", "So What", "Symphony No. 9", "Shake It Off",
                      "One Love", "Smells Like Teen Spirit", "Enter Sandman", "Hound Dog", "Rolling in the Deep",
                      "Stronger", "Like a Prayer", "Space Oddity", "Stairway to Heaven", "Under Pressure", "Umbrella",
                      "Hotline Bling", "Yellow", "Wish You Were Here", "Bad Guy", "Shape of You", "Thank U, Next",
                      "Empire State of Mind", "Born to Run", "Ring of Fire", "Respect", "Purple Rain", "Rocket Man",
                      "My Way", "All of Me", "Firework", "Just the Way You Are", "HUMBLE.", "With or Without You",
                      "Paint It Black", "Sorry", "Hips Don't Lie", "I Will Always Love You", "Paris",
                      "Kill Yourself (Part III)", "Slow Dancing in the Dark", "SLOW DANCING IN THE DARK", "Creep",
                      "Karma Police", "Somebody Else", "Love It If We Made It", "Pulse", "Ethereal", "End Credits",
                      "Blind Faith", "Outbreak", "One Moment", "Intro", "Angels", "Arrakis", "Caterpillar", "X",
                      "Concrete", "Abbey Road", "Lemonade", "The Eminem Show", "Kind of Blue",
                      "Beethoven: Complete Symphonies", "1989", "Legend", "Nevermind", "Master of Puppets",
                      "Elvis' Golden Records", "25", "The College Dropout", "Like a Virgin",
                      "The Rise and Fall of Ziggy Stardust", "Led Zeppelin IV", "A Night at the Opera", "ANTI",
                      "Scorpion", "A Rush of Blood to the Head", "The Dark Side of the Moon",
                      "I Want to Die in New Orleans", "BALLADS 1", "OK Computer",
                      "A Brief Inquiry into Online Relationships", "Abyss", "Brand New Machine", "Louder", "xx",
                      "Driving Insane", "I Disagree"]

def calculate_product_match(user_keywords, product_keywords):
    if len(user_keywords) < 1:
        return 0

    user_keywords = [x.lower() for x in user_keywords]
    product_keywords = [x.lower() for x in product_keywords]

    matches = 0

    for keyword in user_keywords:
        if keyword in product_keywords:
            matches = matches + 1

    return round((matches / len(product_keywords)) * 100)

def sort_by_match(products):
    for product in products:
        product['matchPercentage'] = calculate_product_match(DEMO_ONLY_KEYWORDS, product['keywords'])
    return sorted(products, key=lambda x: x['matchPercentage'], reverse=True)