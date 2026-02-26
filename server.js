// =============================================
// HIDDEN IN PLAIN SIGHT — Jackbox-Style Server
// =============================================
// Run: node server.js
// Teacher: open http://localhost:3000
// Students: open http://<your-ip>:3000/play
// =============================================

const http = require('http');
const { WebSocketServer } = require('ws');
const os = require('os');

const PORT = process.env.PORT || 3000;

// ========== QUESTION BANK ==========
const ALL_QUESTIONS = [
  {
    story: "Abraham and Isaac on Mount Moriah",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg/800px-Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg",
    reference: "Genesis 22:1\u201314",
    description: "God asked Abraham to offer his son Isaac as a sacrifice on Mount Moriah. Abraham obeyed, and as he raised the knife, an angel stopped him. A ram caught in a thicket was provided as a substitute sacrifice. Abraham named the place \u201cJehovah-jireh\u201d \u2014 the Lord will provide.",
    question: "How does this story point to Jesus Christ?",
    answers: [
      "A loving Father was willing to sacrifice His Only Begotten Son \u2014 and a substitute was provided",
      "Abraham\u2019s obedience was tested so we could learn to follow God even when the path is painful",
      "The ram in the thicket taught Israel that animal sacrifice was central to proper worship",
      "Mount Moriah was chosen because high places were where God revealed His will to prophets"
    ],
    correct: 0,
    explanation: "Just as Abraham was willing to sacrifice Isaac, Heavenly Father offered His Only Begotten Son. Isaac carried the wood for his own sacrifice, as Jesus carried His cross. A substitute (the ram) was provided \u2014 pointing to Christ as the ultimate substitute for all of us.",
    scripture: "\u201cGod will provide himself a lamb for a burnt offering\u201d \u2014 Genesis 22:8"
  },
  {
    story: "The Passover Lamb in Egypt",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/035.The_Firstborn_of_the_Egyptians_Are_Slain.jpg/800px-035.The_Firstborn_of_the_Egyptians_Are_Slain.jpg",
    reference: "Exodus 12:3\u201313",
    description: "Before the final plague in Egypt, each Israelite family was told to choose a lamb without blemish, sacrifice it, and paint its blood on their doorposts. The destroyer would then \u201cpass over\u201d those homes, sparing their firstborn from death.",
    question: "What does the Passover lamb represent?",
    answers: [
      "Israel\u2019s obedient faith in following Moses\u2019s instructions as a covenant people",
      "Jesus Christ, the Lamb of God, whose blood saves us from spiritual death",
      "The need to prepare nourishment and provisions before the long exodus journey",
      "God\u2019s supreme authority was demonstrated by overpowering each Egyptian god"
    ],
    correct: 1,
    explanation: "The Passover lamb had to be \u201cwithout blemish\u201d \u2014 just as Christ was sinless. Its blood on the doorpost saved families from death, just as Christ\u2019s atoning blood saves us from spiritual death.",
    scripture: "\u201cBehold the Lamb of God, which taketh away the sin of the world\u201d \u2014 John 1:29"
  },
  {
    story: "Moses Lifts the Brazen Serpent",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/042.The_Bronze_Serpent.jpg/800px-042.The_Bronze_Serpent.jpg",
    reference: "Numbers 21:6\u20139",
    description: "When poisonous serpents bit the Israelites in the wilderness, Moses was commanded to make a serpent of brass and lift it high on a pole. Anyone who had been bitten could simply look upon the brass serpent and live.",
    question: "What did the serpent lifted on the pole symbolize?",
    answers: [
      "The bronze material had healing properties that ancient Israel understood",
      "Moses served as a mediator by crafting a remedy for God\u2019s suffering people",
      "Christ being \u201clifted up\u201d on the cross \u2014 all who look to Him will be saved",
      "The serpents taught Israel that complaining against God brings consequences"
    ],
    correct: 2,
    explanation: "Jesus Himself explained this connection directly. Just as the Israelites had to look up at the brazen serpent to be physically healed, we must look to Christ \u2014 lifted upon the cross \u2014 to be spiritually healed and saved.",
    scripture: "\u201cAs Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up\u201d \u2014 John 3:14"
  },
  {
    story: "Joseph Sold into Egypt",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_038.png/800px-Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_038.png",
    reference: "Genesis 37; 45:1\u20138",
    description: "Joseph\u2019s brothers were jealous of him. They sold him for twenty pieces of silver and told their father he was dead. Years later, Joseph rose to become the second most powerful man in Egypt and saved his entire family from famine \u2014 weeping as he forgave the very brothers who betrayed him.",
    question: "How is Joseph a \u201ctype\u201d of Christ?",
    answers: [
      "He received a coat of many colors from his father, showing that God singles out the righteous for special blessings and favor",
      "He had prophetic dreams about the sun, moon, and stars, showing he was given the gift of prophecy like many ancient seers",
      "He was betrayed and sold for silver, yet rose to power, saved his people, and freely forgave those who wronged him",
      "He lived faithfully in a foreign land among unbelievers, showing that the righteous can thrive anywhere God places them"
    ],
    correct: 2,
    explanation: "Like Christ, Joseph was betrayed by those closest to him and sold for silver. He suffered unjustly, was raised to a position of great power, then became the deliverer and savior of his people.",
    scripture: "\u201cYe thought evil against me; but God meant it unto good \u2026 to save much people alive\u201d \u2014 Genesis 50:20"
  },
  {
    story: "Manna from Heaven",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tissot_The_Gathering_of_the_Manna_%28color%29.jpg/800px-Tissot_The_Gathering_of_the_Manna_%28color%29.jpg",
    reference: "Exodus 16:14\u201318, 31",
    description: "When the Israelites were hungry in the wilderness, God sent bread from heaven each morning \u2014 a small, white, sweet substance they called manna. It appeared on the ground like dew and had to be gathered fresh every day.",
    question: "What did the manna foreshadow?",
    answers: [
      "Jesus Christ, the true \u201cBread of Life\u201d sent from heaven to sustain us spiritually",
      "God\u2019s daily care for Israel in the wilderness, teaching them patience and reliance on Him",
      "The miraculous creative power of God, who can bring forth nourishment out of nothing",
      "Israel\u2019s need to gather and prepare provisions each day during their long wilderness journey"
    ],
    correct: 0,
    explanation: "Jesus taught that He is the true bread from heaven. Just as manna was given freely each day to sustain physical life, Christ offers Himself freely to sustain our spiritual lives.",
    scripture: "\u201cI am the bread of life: he that cometh to me shall never hunger\u201d \u2014 John 6:35"
  },
  {
    story: "Water from the Rock at Horeb",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/041.Moses_Strikes_the_Rock_at_Horeb.jpg/800px-041.Moses_Strikes_the_Rock_at_Horeb.jpg",
    reference: "Exodus 17:1\u20136",
    description: "When the Israelites were desperate for water in the desert, the Lord told Moses to strike a rock at Horeb with his rod. When he did, water poured from the rock and the people drank freely.",
    question: "What does the rock that gave water represent?",
    answers: [
      "God\u2019s ability to provide for physical needs in unexpected ways in the desert",
      "Moses\u2019s prophetic authority, through which he could command the elements",
      "Jesus Christ \u2014 the source of \u201cliving water\u201d that quenches spiritual thirst",
      "Israel\u2019s faithfulness in trusting God despite their difficult desert journey"
    ],
    correct: 2,
    explanation: "The apostle Paul taught directly that \u201cthat Rock was Christ.\u201d The water that saved the Israelites from physical death points to the living water Christ offers us \u2014 salvation from spiritual death.",
    scripture: "\u201cThey drank of that spiritual Rock that followed them: and that Rock was Christ\u201d \u2014 1 Corinthians 10:4"
  },
  {
    story: "The Day of Atonement",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/14/High_Priest_Offering_Sacrifice_of_a_Goat.jpg",
    reference: "Leviticus 16:7\u201310, 21\u201322",
    description: "Once a year on the holiest day, the high priest took two goats. One was sacrificed as a sin offering. The other \u2014 the \u201cscapegoat\u201d \u2014 had the sins of all the people symbolically placed upon its head. It was then sent into the wilderness, carrying their sins far away.",
    question: "How does the Day of Atonement point to Christ?",
    answers: [
      "It teaches Israel to set aside a sacred day each year for communal repentance and spiritual renewal",
      "Christ took upon Himself the sins of the world and carried them away \u2014 He is both sacrifice and scapegoat",
      "It shows that ritual sacrifice was a central part of Israelite worship and covenant faithfulness",
      "It represents the high priest\u2019s unique role as the only mediator between God and His covenant people"
    ],
    correct: 1,
    explanation: "The entire Day of Atonement ceremony was a powerful symbol of what Jesus would do. He is both the sacrificial offering and the one who carries our sins away.",
    scripture: "\u201cThe Lord hath laid on him the iniquity of us all\u201d \u2014 Isaiah 53:6"
  },
  {
    story: "Jonah and the Great Fish",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dore_jonah_whale.jpg",
    reference: "Jonah 1:17; 2:10",
    description: "The prophet Jonah fled from God\u2019s command and was swallowed by a great fish. He spent three days and three nights in complete darkness inside its belly. On the third day, he was brought forth alive.",
    question: "What did Jonah\u2019s three days in the fish foreshadow?",
    answers: [
      "God\u2019s power over all of creation, including the creatures of the sea",
      "That God can use even fearsome beasts to redirect a wayward prophet",
      "Christ\u2019s three days in the tomb before His glorious resurrection",
      "The serious consequences that come when we try to flee from God\u2019s call"
    ],
    correct: 2,
    explanation: "Jesus specifically pointed to Jonah as a sign of His own death and resurrection. Just as Jonah spent three days in darkness and was then brought forth alive, Christ spent three days in the tomb and rose again.",
    scripture: "\u201cAs Jonas was three days and three nights in the whale\u2019s belly; so shall the Son of man be three days and three nights in the heart of the earth\u201d \u2014 Matthew 12:40"
  },
  {
    story: "The Suffering Servant",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/120.The_Prophet_Isaiah.jpg/800px-120.The_Prophet_Isaiah.jpg",
    reference: "Isaiah 53:3\u20137",
    description: "Seven hundred years before Christ\u2019s birth, Isaiah described a future figure who would be \u201cdespised and rejected,\u201d a \u201cman of sorrows\u201d acquainted with grief. He would be \u201cwounded for our transgressions\u201d and led \u201cas a lamb to the slaughter.\u201d",
    question: "Who is the Suffering Servant Isaiah described?",
    answers: [
      "The nation of Israel as a whole, suffering collectively among the nations",
      "Isaiah himself, who endured grief while prophesying to a rebellious people",
      "A righteous king of Babylon who would arise to free the Israelites from exile",
      "Jesus Christ \u2014 this is a direct messianic prophecy of His atoning sacrifice"
    ],
    correct: 3,
    explanation: "Isaiah 53 is one of the most remarkable and detailed prophecies of Jesus Christ in all scripture, written some 700 years before His birth.",
    scripture: "\u201cHe was wounded for our transgressions, he was bruised for our iniquities\u201d \u2014 Isaiah 53:5"
  },
  {
    story: "Adam and the Fall",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/003.Adam_and_Eve_Are_Driven_out_of_Eden.jpg/800px-003.Adam_and_Eve_Are_Driven_out_of_Eden.jpg",
    reference: "Genesis 3:17\u201319; Moses 6:48",
    description: "When Adam and Eve partook of the fruit, the Fall brought both physical and spiritual death into the world. But even in that moment, God promised that a future Savior would come to overcome what the Fall had set in motion.",
    question: "How does Adam\u2019s story connect to Jesus Christ?",
    answers: [
      "Adam\u2019s experience in the Garden of Eden teaches us about the beauty and sacredness of God\u2019s creations",
      "Christ is the \u201csecond Adam\u201d who overcame the Fall \u2014 redeeming us from both physical and spiritual death",
      "The Fall shows that choosing obedience to God\u2019s commandments always brings us immediate blessings",
      "Adam\u2019s story is primarily about the beginning of mortal life on earth and human agency in the garden"
    ],
    correct: 1,
    explanation: "Adam brought the Fall, which made mortality and death a reality for all of us. Christ, called the \u201clast Adam\u201d by Paul, overcame both physical and spiritual death through His atonement and resurrection.",
    scripture: "\u201cFor as in Adam all die, even so in Christ shall all be made alive\u201d \u2014 1 Corinthians 15:22"
  },
  {
    story: "Ruth and Boaz \u2014 The Kinsman Redeemer",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/069.Ruth_and_Boaz.jpg/800px-069.Ruth_and_Boaz.jpg",
    reference: "Ruth 3\u20134",
    description: "Ruth, a Moabite widow, was destitute and far from home. Boaz, a wealthy and honorable relative, chose to act as her \u201ckinsman redeemer\u201d \u2014 he had the right, the resources, and the willingness to redeem her and restore everything lost.",
    question: "How does Boaz represent Jesus Christ?",
    answers: [
      "He was a prosperous man of standing in Bethlehem, showing that the Lord rewards faithfulness with earthly blessings and abundance",
      "He welcomed Ruth the Moabite foreigner into the covenant, showing that God\u2019s grace extends beyond Israel to all nations",
      "Like Christ our Redeemer, he had the family right, the power, and the loving willingness to save someone who could not save herself",
      "He was lord of the harvest, gathering workers into his fields, which symbolizes how God gathers souls into His kingdom"
    ],
    correct: 2,
    explanation: "Boaz is one of the most beautiful \u201ctypes\u201d of Christ. As a kinsman redeemer, he had the family connection (right), the wealth (power), and the compassionate willingness (love) to redeem Ruth.",
    scripture: "\u201cI know that my redeemer liveth\u201d \u2014 Job 19:25"
  },
  {
    story: "Melchizedek, King of Salem",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Pierre_Paul_Rubens_-_Abraham_et_Melchis%C3%A9dech.jpg/800px-Pierre_Paul_Rubens_-_Abraham_et_Melchis%C3%A9dech.jpg",
    reference: "Genesis 14:18\u201320",
    description: "After Abraham rescued Lot, he was met by Melchizedek \u2014 the king of Salem and also a priest of the most high God. Melchizedek brought out bread and wine and blessed Abraham.",
    question: "Why is Melchizedek considered a type of Christ?",
    answers: [
      "He was both a king and a priest \u2014 foreshadowing Christ\u2019s role as King of Kings and our Great High Priest",
      "He ruled over Salem, which would later become Jerusalem \u2014 the sacred city where God\u2019s temple would stand",
      "He received tithes from Abraham, establishing the principle that God\u2019s people should give offerings to Him",
      "He brought out bread and wine to nourish Abraham, reflecting the ancient custom of honoring a victorious ally"
    ],
    correct: 0,
    explanation: "Melchizedek uniquely combined the roles of both king and priest \u2014 just as Christ is both the King of Kings and our Great High Priest. The bread and wine foreshadow the sacrament.",
    scripture: "\u201cThou art a priest for ever after the order of Melchizedek\u201d \u2014 Psalm 110:4"
  },
  {
    story: "The Ark of the Covenant",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/James_Jacques_Joseph_Tissot_-_The_Ark_Passes_Over_the_Jordan_-_Google_Art_Project.jpg/800px-James_Jacques_Joseph_Tissot_-_The_Ark_Passes_Over_the_Jordan_-_Google_Art_Project.jpg",
    reference: "Exodus 25:10\u201322",
    description: "God commanded Moses to build a sacred chest overlaid with gold. Inside were the tablets of the law, a pot of manna, and Aaron\u2019s rod that budded. Above it sat the mercy seat, where God\u2019s presence dwelt.",
    question: "How does the Ark of the Covenant symbolize Jesus Christ?",
    answers: [
      "It was overlaid with pure gold, teaching Israel that the most precious materials should be set apart for the worship of God",
      "It was carried only by the Levites, showing that access to God\u2019s holiest things requires proper priesthood authority and worthiness",
      "Like Christ, it held God\u2019s law within it, provided life-giving bread, and was the place where God\u2019s presence and mercy met mankind",
      "It was kept behind the veil in the Holy of Holies, reminding Israel that God\u2019s deepest truths are revealed only to the faithful"
    ],
    correct: 2,
    explanation: "The Ark contained the law (Christ fulfilled the law), manna (He is the Bread of Life), and Aaron\u2019s rod that budded (He is the resurrection and the life). The mercy seat is where God\u2019s presence met His people.",
    scripture: "\u201cThere I will meet with thee, and I will commune with thee from above the mercy seat\u201d \u2014 Exodus 25:22"
  },
  {
    story: "Jacob\u2019s Ladder",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/El_sue%C3%B1o_de_Jacob%2C_por_Jos%C3%A9_de_Ribera.jpg/800px-El_sue%C3%B1o_de_Jacob%2C_por_Jos%C3%A9_de_Ribera.jpg",
    reference: "Genesis 28:12\u201317",
    description: "While fleeing from Esau, Jacob dreamed of a great ladder reaching from earth to heaven. Angels ascended and descended on it, and the Lord stood at the top, renewing His covenant promises.",
    question: "How does Jacob\u2019s ladder point to Jesus Christ?",
    answers: [
      "Angels serve as God\u2019s messengers, carrying His words between heaven and earth to guide His covenant people",
      "Christ is the connection between heaven and earth \u2014 the only way by which we can ascend to God",
      "Jacob\u2019s dream teaches that covenant promises are renewed in holy, set-apart places where God\u2019s Spirit dwells",
      "The ladder represents the step-by-step spiritual progression required to eventually return to God\u2019s presence"
    ],
    correct: 1,
    explanation: "Jesus identified Himself as the fulfillment of Jacob\u2019s ladder. He is the bridge between heaven and earth, the way by which God descends to us and we ascend to Him.",
    scripture: "\u201cHereafter ye shall see heaven open, and the angels of God ascending and descending upon the Son of man\u201d \u2014 John 1:51"
  },
  {
    story: "Moses Parts the Red Sea",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/037.The_Egyptians_Drown_in_the_Sea.jpg/800px-037.The_Egyptians_Drown_in_the_Sea.jpg",
    reference: "Exodus 14:13\u201322",
    description: "With Pharaoh\u2019s army behind them and the sea blocking their path, the Israelites were trapped. Moses stretched out his hand, and God parted the Red Sea, creating a dry path through the waters.",
    question: "How does the parting of the Red Sea symbolize what Christ does for us?",
    answers: [
      "It demonstrates God\u2019s supreme power and authority over all the forces and elements of the natural world",
      "Christ delivers us from the bondage of sin and death \u2014 making a way through when there seems to be no way",
      "It teaches Israel to follow their prophet\u2019s instructions with exactness, even when the situation seems hopeless",
      "It reveals that sincere, faith-filled prayer can unlock God\u2019s miraculous intervention in desperate moments"
    ],
    correct: 1,
    explanation: "The Israelites were trapped between slavery and death with no human escape. But God made a way through the impossible. This is what Christ does for each of us.",
    scripture: "\u201cFear ye not, stand still, and see the salvation of the Lord\u201d \u2014 Exodus 14:13"
  },
  {
    story: "The Tabernacle and Its Veil",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Tissot_Moses_and_Joshua_in_the_Tabernacle.jpg/800px-Tissot_Moses_and_Joshua_in_the_Tabernacle.jpg",
    reference: "Exodus 26:31\u201333",
    description: "Inside the tabernacle, a thick veil separated the Holy Place from the Holy of Holies \u2014 the inner room where God\u2019s presence dwelt. No one could pass except the high priest, once a year, with the blood of a sacrifice.",
    question: "What did the veil of the tabernacle represent?",
    answers: [
      "The separation between God and mankind \u2014 which Christ\u2019s sacrifice tore open, giving all of us access to the Father",
      "The sacredness of God\u2019s dwelling place, which required the finest materials and most skilled artisans to create",
      "The principle that certain aspects of worship must be kept private and performed only by authorized servants",
      "A reminder that the deeper mysteries of God are reserved for those who have proven themselves worthy and faithful"
    ],
    correct: 0,
    explanation: "When Jesus died on the cross, the veil of the temple was miraculously torn from top to bottom \u2014 signifying that through His sacrifice, the way to God\u2019s presence is now open to everyone.",
    scripture: "\u201cJesus \u2026 yielded up the ghost. And, behold, the veil of the temple was rent in twain from the top to the bottom\u201d \u2014 Matthew 27:50\u201351"
  },
  {
    story: "Daniel in the Lions\u2019 Den",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/131.Daniel_in_the_Lions%27_Den.jpg/800px-131.Daniel_in_the_Lions%27_Den.jpg",
    reference: "Daniel 6:16\u201323",
    description: "Daniel was thrown into a den of hungry lions because he refused to stop praying to God. A stone was placed over the mouth of the den and sealed. The next morning, Daniel was found alive and unharmed.",
    question: "How does Daniel\u2019s experience parallel the story of Jesus Christ?",
    answers: [
      "Both were condemned by jealous enemies, sealed in a stone-covered place, and came forth alive \u2014 conquering death",
      "It teaches that consistent, faithful prayer gives us power to overcome any threat or danger we may face in life",
      "The lions represent the destructive forces of Satan, and God\u2019s angel intervened to protect His faithful servant",
      "Daniel chose God\u2019s higher law over the king\u2019s decree, teaching us that obedience to God must always come first"
    ],
    correct: 0,
    explanation: "Like Christ, Daniel was condemned by jealous conspirators despite his innocence. He was placed in a pit sealed with a stone. He was expected to be dead \u2014 but was found alive. Daniel\u2019s deliverance foreshadows Christ\u2019s victory over the sealed tomb.",
    scripture: "\u201cMy God hath sent his angel, and hath shut the lions\u2019 mouths\u201d \u2014 Daniel 6:22"
  },
  {
    story: "Noah\u2019s Ark and the Flood",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/007.The_Great_Flood.jpg/800px-007.The_Great_Flood.jpg",
    reference: "Genesis 6:14\u201318; 7:1",
    description: "When the earth was filled with wickedness, God told Noah to build an ark \u2014 the only means of salvation from the coming flood. Noah\u2019s family entered the ark, and God Himself shut the door. Only those inside were saved.",
    question: "How does the ark represent Jesus Christ?",
    answers: [
      "Noah\u2019s years of faithful labor in building the ark show that God blesses those who are willing to work hard and endure in obedience",
      "Christ is the only means of salvation \u2014 just as the ark was the only refuge from destruction, He is our only refuge from sin and death",
      "God commanded Noah to preserve every kind of creature, teaching us that all living things are precious in God\u2019s sight and plan",
      "The ark sheltered Noah\u2019s entire family together, symbolizing that God intends families to stay united through trials and adversity"
    ],
    correct: 1,
    explanation: "The ark was the sole means of salvation. In the same way, Jesus Christ is the only way to be saved from spiritual destruction. Peter himself compared baptism to the waters of Noah.",
    scripture: "\u201cThe Lord shut him in\u201d \u2014 Genesis 7:16"
  },
  {
    story: "The Bronze Altar of Burnt Offering",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Holman_The_Burning_of_the_Offerings.jpg/800px-Holman_The_Burning_of_the_Offerings.jpg",
    reference: "Exodus 27:1\u20138; Leviticus 1:3\u20139",
    description: "At the tabernacle entrance stood a great bronze altar where animals were sacrificed. The animal had to be \u201cwithout blemish.\u201d The person bringing it would lay their hands on the animal\u2019s head \u2014 symbolically transferring their sins \u2014 before it was sacrificed in their place.",
    question: "What did the burnt offering on the altar foreshadow?",
    answers: [
      "The principle that true devotion to God requires us to give up something valuable and personally costly",
      "Christ\u2019s perfect, sinless sacrifice on the cross \u2014 He took our sins upon Himself and died in our place",
      "That genuine worship demands real effort, dedication, and a willingness to bring our very best offering to God",
      "The role of livestock and herds in Israel\u2019s covenant life, as they were the most valuable possession a family owned"
    ],
    correct: 1,
    explanation: "Every element pointed to Christ. The animal had to be without blemish \u2014 Christ was sinless. The offerer laid hands on its head \u2014 our sins were laid upon Christ. The animal died in the person\u2019s place \u2014 Christ died as our substitute.",
    scripture: "\u201cHe hath made him to be sin for us, who knew no sin\u201d \u2014 2 Corinthians 5:21"
  },
  {
    story: "Joshua Leads Israel into the Promised Land",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Dore_joshua_crossing.jpg",
    reference: "Joshua 1:1\u20139; 3:14\u201317",
    description: "After Moses died, Joshua led Israel across the Jordan River into the promised land. As the priests carrying the ark stepped into the flooded Jordan, the waters parted and all Israel crossed on dry ground.",
    question: "How is Joshua a type of Jesus Christ?",
    answers: [
      "He was a courageous military leader who conquered Canaan, showing that God\u2019s people must fight valiantly for their promised blessings",
      "His name is the Hebrew form of \u201cJesus\u201d \u2014 and like Christ, he led God\u2019s people through the waters of death into the promised inheritance",
      "He succeeded Moses as leader of Israel, symbolizing that the law of Moses would give way to a new and higher covenant from God",
      "He carefully divided the promised land among each of the tribes, showing that God provides a fair inheritance for all His children"
    ],
    correct: 1,
    explanation: "Joshua\u2019s very name \u2014 Yehoshua \u2014 is the Hebrew form of \u201cJesus,\u201d meaning \u201cthe Lord saves.\u201d Just as Joshua led Israel through the Jordan into the promised land, Jesus leads us through death into eternal life.",
    scripture: "\u201cAs I was with Moses, so I will be with thee: I will not fail thee, nor forsake thee\u201d \u2014 Joshua 1:5"
  },
  {
    story: "Elijah\u2019s Sacrifice on Mount Carmel",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/090.The_Prophets_of_Baal_Are_Slaughtered.jpg/800px-090.The_Prophets_of_Baal_Are_Slaughtered.jpg",
    reference: "1 Kings 18:30\u201339",
    description: "On Mount Carmel, Elijah challenged the prophets of Baal. Each side would prepare a sacrifice, and the God who answered by fire would be proven true. The prophets of Baal cried out all day with no answer. Then Elijah soaked his altar with water, prayed once, and fire fell from heaven, consuming everything.",
    question: "How does this event point to Christ?",
    answers: [
      "Elijah\u2019s sacrifice, drenched and impossible to ignite by human effort, was accepted by God\u2019s power alone \u2014 like Christ\u2019s atonement, which accomplishes what no human effort ever could",
      "Elijah\u2019s single faithful prayer prevailed over hundreds of false prophets who cried out all day long, teaching us that sincere and humble prayer is always heard and answered by God",
      "The fire that fell from heaven represents the Holy Ghost, which descends upon the faithful and fills them with power when they worship God in spirit and in truth",
      "God publicly vindicated His prophet Elijah before all of Israel on Mount Carmel, showing that He will always rise up to defend and honor His true servants in due time"
    ],
    correct: 0,
    explanation: "Elijah made the sacrifice impossible by human standards \u2014 yet God\u2019s fire consumed everything. This points to the truth of Christ\u2019s atonement: salvation is accomplished by God\u2019s power, not human effort.",
    scripture: "\u201cBy grace are ye saved through faith; and that not of yourselves: it is the gift of God\u201d \u2014 Ephesians 2:8"
  },
  {
    story: "David and Goliath",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/071A.David_Slays_Goliath.jpg/800px-071A.David_Slays_Goliath.jpg",
    reference: "1 Samuel 17:4\u201350",
    description: "The giant Goliath \u2014 heavily armed and seemingly invincible \u2014 terrorized all of Israel. Then David, a young shepherd with no armor, stepped forward with just a stone and a sling, struck Goliath down, and won the victory for all Israel.",
    question: "How does David\u2019s victory over Goliath foreshadow Christ?",
    answers: [
      "David\u2019s courage in the face of impossible odds teaches that bravery and faith in God can overcome any obstacle we encounter in life",
      "David\u2019s victory without armor or sword shows that spiritual strength and trust in God matter far more than physical power in battle",
      "Like Christ, David was an unlikely champion who fought an enemy no one else could defeat \u2014 winning the victory not for himself, but for all his people",
      "God chose a humble shepherd boy instead of a trained warrior, showing that He works through the meek and lowly rather than the mighty"
    ],
    correct: 2,
    explanation: "David was not fighting for personal glory. As a humble shepherd facing an invincible foe, David prefigures Christ, who as the Good Shepherd faced sin, death, and Satan \u2014 enemies none of us could defeat \u2014 and won the victory for all of us.",
    scripture: "\u201cThe battle is the Lord\u2019s, and he will give you into our hands\u201d \u2014 1 Samuel 17:47"
  },
  {
    story: "The Prophet Hosea and His Unfaithful Wife",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Hosea_and_Gomer.jpg",
    reference: "Hosea 1\u20133",
    description: "God told Hosea to marry Gomer, a woman who would be unfaithful. Despite her repeated unfaithfulness, God commanded Hosea to buy her back from slavery and love her again. His unconditional love was a living parable of God\u2019s love for Israel.",
    question: "How does Hosea\u2019s story illustrate Christ\u2019s love for us?",
    answers: [
      "Hosea\u2019s marriage teaches that covenant relationships are sacred and binding, and they must be honored even when they are difficult",
      "Hosea\u2019s willingness to suffer and endure heartbreak shows that true prophets must sacrifice personally to fulfill God\u2019s purposes",
      "Like Christ, Hosea redeemed his beloved at great personal cost \u2014 buying back one who had gone astray, offering love that was never earned or deserved",
      "Gomer\u2019s unfaithfulness and its painful consequences serve as a warning that turning away from God always leads to bondage and sorrow"
    ],
    correct: 2,
    explanation: "We are like Gomer \u2014 unfaithful, wandering, even enslaved by our sins. And yet Christ, like Hosea, pursues us, pays the price to redeem us, and loves us with an everlasting love we did nothing to deserve.",
    scripture: "\u201cI will betroth thee unto me for ever; yea, I will betroth thee unto me in righteousness\u201d \u2014 Hosea 2:19"
  },
  {
    story: "The Fountain of Living Waters",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/The_Fountain_of_Life_after_van_Eyck_2.jpg/800px-The_Fountain_of_Life_after_van_Eyck_2.jpg",
    reference: "Jeremiah 2:13; 17:13",
    description: "Through the prophet Jeremiah, the Lord declared that His people had committed two evils: they had forsaken Him \u2014 the \u201cfountain of living waters\u201d \u2014 and had hewn out broken cisterns that could hold no water.",
    question: "What does the \u201cfountain of living waters\u201d represent?",
    answers: [
      "The need for Israel to find reliable sources of fresh water in their arid, desert homeland",
      "Jesus Christ, the source of eternal life who alone can quench our spiritual thirst",
      "The temple in Jerusalem, which was the sacred gathering place where Israel worshipped God",
      "The Jordan River, where prophets like Elijah and Elisha performed mighty miracles for Israel"
    ],
    correct: 1,
    explanation: "Just as a living fountain provides fresh, never-ending water, Christ offers us spiritual life that never runs dry. Broken cisterns \u2014 the things of the world \u2014 can never hold or satisfy the way Christ can.",
    scripture: "\u201cThey have forsaken me the fountain of living waters, and hewed them out cisterns, broken cisterns, that can hold no water\u201d \u2014 Jeremiah 2:13"
  },
  {
    story: "The Rock and Fortress",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gerard_van_Honthorst_-_King_David_Playing_the_Harp_-_Google_Art_Project.jpg/800px-Gerard_van_Honthorst_-_King_David_Playing_the_Harp_-_Google_Art_Project.jpg",
    reference: "2 Samuel 22:2\u20134",
    description: "After the Lord delivered David from all his enemies, David sang a song of praise: \u201cThe Lord is my rock, and my fortress, and my deliverer.\u201d He described God as a shield, a high tower, and a refuge.",
    question: "How does David\u2019s description of God as a \u201crock\u201d and \u201cfortress\u201d point to Christ?",
    answers: [
      "Christ is our immovable foundation and sure protection \u2014 He is the one we can always rely on for safety and strength",
      "David found physical refuge in rocky strongholds while fleeing Saul, so he praised God using images from his own experience",
      "God\u2019s holiness and majesty are so great that approaching Him requires preparation, reverence, and deep humility",
      "The imagery of rock connects to the stone tablets of the law, reminding Israel that God\u2019s commandments are unchanging"
    ],
    correct: 0,
    explanation: "A rock cannot be moved; a fortress cannot be easily broken. David used these images to teach that Christ is our unshakable foundation and our ultimate protector in times of trial.",
    scripture: "\u201cThe Lord is my rock, and my fortress, and my deliverer\u201d \u2014 2 Samuel 22:2"
  },
  {
    story: "The Refiner\u2019s Fire",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Prophet_Malachi%2C_from_Prophets_and_Sibyls_MET_DP833954.jpg/800px-The_Prophet_Malachi%2C_from_Prophets_and_Sibyls_MET_DP833954.jpg",
    reference: "Malachi 3:2\u20133",
    description: "The prophet Malachi described the coming Messiah as being like a \u201crefiner\u2019s fire\u201d and \u201cfuller\u2019s soap.\u201d He would sit as a refiner of silver, purifying the sons of Levi until they could offer righteous offerings unto the Lord.",
    question: "What does the image of a refiner\u2019s fire teach about Jesus Christ?",
    answers: [
      "The Messiah would come in judgment to consume the wicked, burning away all wickedness from the earth with righteous fire",
      "Malachi was prophesying that the last days would bring fiery trials and tribulations upon the earth before Christ\u2019s return",
      "Christ purifies us through His Atonement \u2014 removing our impurities like a refiner removes dross from precious metal",
      "It represents the sacred fire of the temple altar, where offerings were consumed as part of Israel\u2019s covenant worship"
    ],
    correct: 2,
    explanation: "A silversmith heats silver and carefully removes the impurities until he can see his own reflection in the metal. In the same way, Christ refines us through His Atonement until we reflect His image.",
    scripture: "\u201cHe shall sit as a refiner and purifier of silver: and he shall purify the sons of Levi\u201d \u2014 Malachi 3:3"
  },
  {
    story: "The Fiery Furnace",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Shadrach%2C_Meshach_and_Abednego_by_J.M.W.Turner_%281832%2C_Tate%29.jpg/800px-Shadrach%2C_Meshach_and_Abednego_by_J.M.W.Turner_%281832%2C_Tate%29.jpg",
    reference: "Daniel 3:23\u201325",
    description: "Shadrach, Meshach, and Abed-nego refused to worship the golden idol and were thrown into a furnace heated seven times hotter than usual. But the king saw four men walking unharmed in the fire \u2014 and the fourth looked \u201clike the Son of God.\u201d",
    question: "What does this story teach about Jesus Christ?",
    answers: [
      "If we have enough faith and remain perfectly obedient, God will shield us from all physical harm and suffering",
      "Christ stands with us in our trials \u2014 He does not always remove the furnace, but He walks through it with us",
      "The faith of these three men was so powerful that it literally changed the nature of the fire around them",
      "The fourth figure was a guardian angel sent to protect the faithful, showing that God sends angels in times of need"
    ],
    correct: 1,
    explanation: "The Savior\u2019s presence in the furnace is a powerful reminder that He will support us in our trials. He doesn\u2019t always remove the difficulty, but He is always with us in the middle of it.",
    scripture: "\u201cLo, I see four men loose, walking in the midst of the fire \u2026 and the form of the fourth is like the Son of God\u201d \u2014 Daniel 3:25"
  },
  {
    story: "The Lord Looks on the Heart",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Felix-Joseph_Barrias_-_Anointing_of_David_by_Samuel.jpg/800px-Felix-Joseph_Barrias_-_Anointing_of_David_by_Samuel.jpg",
    reference: "1 Samuel 16:6\u20137",
    description: "When Samuel came to anoint a new king, he saw Jesse\u2019s eldest son Eliab and thought, \u201cSurely the Lord\u2019s anointed is before him.\u201d But the Lord told Samuel not to look on his appearance or height \u2014 \u201cthe Lord looketh on the heart.\u201d The young shepherd David was chosen instead.",
    question: "How does this story reflect Christ\u2019s nature?",
    answers: [
      "God rejected Eliab because outward stature and appearance are never reliable indicators of true spiritual leadership",
      "Like the Lord who chose David, Christ sees our true worth and potential \u2014 He looks past outward appearances and into our hearts",
      "David was chosen over his brothers because he had the strongest character and the deepest devotion to keeping God\u2019s flocks",
      "Even the prophet Samuel was mistaken at first, teaching us that all mortals are limited in their ability to judge others"
    ],
    correct: 1,
    explanation: "Christ does not judge us the way the world does. He sees who we really are and who we can become. This gives hope to everyone who feels overlooked or not enough.",
    scripture: "\u201cThe Lord seeth not as man seeth; for man looketh on the outward appearance, but the Lord looketh on the heart\u201d \u2014 1 Samuel 16:7"
  },
  {
    story: "Though Your Sins Be as Scarlet",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/120.The_Prophet_Isaiah.jpg/800px-120.The_Prophet_Isaiah.jpg",
    reference: "Isaiah 1:16\u201318",
    description: "Through the prophet Isaiah, the Lord invited His people to repent and reason with Him. He gave one of the most beautiful promises in all scripture: \u201cThough your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.\u201d",
    question: "What does this promise teach about Jesus Christ?",
    answers: [
      "Christ has the power to completely cleanse us from sin \u2014 no stain is too deep for His Atonement to remove",
      "The imagery of white and scarlet teaches Israel that purity before God requires outward signs of holiness and devotion",
      "Isaiah used vivid poetic language about colors and dyes to stir Israel\u2019s emotions and call them back to repentance",
      "God promises forgiveness for those whose sins are small, but the truly scarlet sins require a much deeper form of repentance"
    ],
    correct: 0,
    explanation: "Scarlet dye was permanent in the ancient world \u2014 it could never be washed out. By using this image, the Lord teaches that even sins we think are permanent can be completely erased through the Savior\u2019s Atonement.",
    scripture: "\u201cThough your sins be as scarlet, they shall be as white as snow\u201d \u2014 Isaiah 1:18"
  },
  {
    story: "Immanuel \u2014 God with Us",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Jesaja_%28Michelangelo%29.jpg/800px-Jesaja_%28Michelangelo%29.jpg",
    reference: "Isaiah 7:14",
    description: "When King Ahaz faced invasion and fear, the prophet Isaiah delivered a sign from the Lord: \u201cA virgin shall conceive, and bear a son, and shall call his name Immanuel\u201d \u2014 meaning \u201cGod with us.\u201d",
    question: "What does the name \u201cImmanuel\u201d teach about Jesus Christ?",
    answers: [
      "Immanuel was a common name given to children in ancient Israel as a sign of hope and trust in God\u2019s protection",
      "The name Immanuel pointed to a future warrior-king who would deliver Israel from its enemies through military power",
      "Christ is literally God who came to dwell among us \u2014 He is always with us and will never leave us alone",
      "Isaiah gave himself the symbolic title of Immanuel to reassure King Ahaz that God was with His prophet during the crisis"
    ],
    correct: 2,
    explanation: "Immanuel means \u201cGod with us.\u201d This is one of the most profound truths of the gospel: Jesus Christ is not a distant God. He came to earth, lived among us, and promises to be with us always.",
    scripture: "\u201cBehold, a virgin shall conceive, and bear a son, and shall call his name Immanuel\u201d \u2014 Isaiah 7:14"
  },
  {
    story: "Thy Maker Is Thine Husband",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Hosea_by_James_Tissot.jpg",
    reference: "Isaiah 54:5",
    description: "Isaiah used the tender image of marriage to describe God\u2019s relationship with His covenant people. He declared, \u201cThy Maker is thine husband; the Lord of hosts is his name; and thy Redeemer the Holy One of Israel.\u201d",
    question: "What does the metaphor of God as a \u201chusband\u201d teach about Christ?",
    answers: [
      "Isaiah\u2019s marriage metaphor teaches that entering into the marriage covenant is essential for our eternal salvation and exaltation",
      "Christ is bound to us by covenant \u2014 He is faithful, devoted, and will never abandon His people even when they stray",
      "The husband imagery was a cultural metaphor common in the ancient Near East that carried no deeper spiritual significance",
      "This metaphor applied specifically to ancient Israel\u2019s covenant with God, but it does not extend to us in modern times"
    ],
    correct: 1,
    explanation: "Marriage in scripture symbolizes the deepest covenant relationship. Christ is the faithful husband who never breaks His covenants, who pursues us when we wander, and who loves us with perfect, everlasting devotion.",
    scripture: "\u201cThy Maker is thine husband; the Lord of hosts is his name; and thy Redeemer the Holy One of Israel\u201d \u2014 Isaiah 54:5"
  }
];

// ========== GAME STATE ==========
const TOTAL_ROUNDS = 22;
let gameState = {
  status: 'lobby',  // lobby | playing | scoreboard | wager | finalResults
  teams: [],
  players: [],      // { id, name, teamIndex, ws }
  questions: [],
  currentRound: 0,
  phase: 'waiting',  // waiting | story | choices | revealed
  bonusRounds: new Set(),
  isFinalRound: false,
  wagers: [],
  roundAnswers: [],  // { playerId, playerName, teamIndex, answerIndex, timestamp }
  answerMap: [],     // shuffled answer indices for current round
  roomCode: '',
  scoringMode: 'team',  // 'team' | 'individual' | 'speed'
  timerActive: false,
  timerEnd: 0,
};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Init room code
gameState.roomCode = generateRoomCode();

const TEAM_PRESETS = [
  { emoji: '\u{1F981}', color: '#FF9F0A', name: 'Lions of Judah' },
  { emoji: '\u26A1', color: '#0A84FF', name: 'Pillars of Fire' },
  { emoji: '\u{1F30A}', color: '#64D2FF', name: 'Red Sea Walkers' },
  { emoji: '\u{1F525}', color: '#BF5AF2', name: 'Burning Bush' }
];

// ========== WEBSOCKET CONNECTIONS ==========
let teacherWs = null;
const playerConnections = new Map(); // id -> ws
let nextPlayerId = 1;

function broadcastToPlayers(msg) {
  const data = JSON.stringify(msg);
  for (const [id, ws] of playerConnections) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function sendToTeacher(msg) {
  if (teacherWs && teacherWs.readyState === 1) {
    teacherWs.send(JSON.stringify(msg));
  }
}

function getTeamPlayerCounts() {
  const counts = {};
  gameState.teams.forEach((_, i) => counts[i] = 0);
  gameState.players.forEach(p => {
    if (counts[p.teamIndex] !== undefined) counts[p.teamIndex]++;
  });
  return counts;
}

function broadcastGameState() {
  const teacherState = {
    type: 'gameState',
    status: gameState.status,
    teams: gameState.teams,
    currentRound: gameState.currentRound,
    totalRounds: TOTAL_ROUNDS,
    phase: gameState.phase,
    bonusRounds: [...gameState.bonusRounds],
    isFinalRound: gameState.isFinalRound,
    wagers: gameState.wagers,
    roundAnswers: gameState.roundAnswers.map(a => ({
      playerName: a.playerName,
      teamIndex: a.teamIndex,
      answerIndex: a.answerIndex,
      timestamp: a.timestamp,
      correct: a.answerIndex !== undefined ? gameState.answerMap[a.answerIndex] === gameState.questions[gameState.currentRound]?.correct : false
    })),
    question: gameState.questions[gameState.currentRound] || null,
    answerMap: gameState.answerMap,
    playerCount: gameState.players.length,
    teamPlayerCounts: getTeamPlayerCounts(),
    roomCode: gameState.roomCode,
    scoringMode: gameState.scoringMode,
    timerEnd: gameState.timerEnd || 0
  };
  sendToTeacher(teacherState);

  // Send player-appropriate state
  const q = gameState.questions[gameState.currentRound];
  for (const player of gameState.players) {
    const ws = playerConnections.get(player.id);
    if (!ws || ws.readyState !== 1) continue;

    const hasAnswered = gameState.roundAnswers.some(a => a.playerId === player.id);
    const playerAnswer = gameState.roundAnswers.find(a => a.playerId === player.id);

    const playerState = {
      type: 'gameState',
      status: gameState.status,
      phase: gameState.phase,
      currentRound: gameState.currentRound,
      totalRounds: TOTAL_ROUNDS,
      isBonus: gameState.bonusRounds.has(gameState.currentRound),
      isFinalRound: gameState.isFinalRound,
      teamIndex: player.teamIndex,
      teamName: gameState.teams[player.teamIndex]?.name || '',
      teamEmoji: gameState.teams[player.teamIndex]?.emoji || '',
      teamColor: gameState.teams[player.teamIndex]?.color || '',
      teams: gameState.teams.map(t => ({ name: t.name, emoji: t.emoji, color: t.color, score: t.score })),
      hasAnswered,
      myAnswer: playerAnswer?.answerIndex,
      scoringMode: gameState.scoringMode,
      timerEnd: gameState.timerEnd || 0,
      teamLocked: gameState.scoringMode === 'speed' && gameState.roundAnswers.some(a => a.teamIndex === player.teamIndex),
      teamLockedBy: gameState.scoringMode === 'speed' ? (gameState.roundAnswers.find(a => a.teamIndex === player.teamIndex)?.playerName || '') : '',
    };

    if (gameState.phase === 'choices' || gameState.phase === 'revealed') {
      playerState.question = q?.question;
      playerState.answers = gameState.answerMap.map(origIdx => q?.answers[origIdx]);
    }
    if (gameState.phase === 'revealed') {
      playerState.correctIndex = gameState.answerMap.indexOf(q?.correct);
      playerState.explanation = q?.explanation;
      playerState.scripture = q?.scripture;
    }
    if (gameState.phase === 'story') {
      playerState.storyTitle = q?.story;
    }

    ws.send(JSON.stringify(playerState));
  }
}

function handlePlayerMessage(playerId, msg) {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  if (msg.type === 'answer' && gameState.phase === 'choices') {
    if (gameState.scoringMode === 'speed') {
      // Speed mode: only the first answer per team counts
      if (gameState.roundAnswers.some(a => a.teamIndex === player.teamIndex)) return;
    } else {
      // Team/Individual: one answer per player
      if (gameState.roundAnswers.some(a => a.playerId === playerId)) return;
    }

    gameState.roundAnswers.push({
      playerId,
      playerName: player.name,
      teamIndex: player.teamIndex,
      answerIndex: msg.answerIndex,
      timestamp: Date.now()
    });

    broadcastGameState();
  }
}

function handleTeacherMessage(msg) {
  if (msg.type === 'startGame') {
    // Set up teams
    const teamCount = msg.teamCount || 3;
    gameState.teams = [];
    for (let i = 0; i < teamCount; i++) {
      gameState.teams.push({
        name: (msg.teamNames && msg.teamNames[i]) || TEAM_PRESETS[i].name,
        emoji: TEAM_PRESETS[i].emoji,
        color: TEAM_PRESETS[i].color,
        score: 0,
        correctCount: 0
      });
    }

    gameState.scoringMode = msg.scoringMode || 'team';
    gameState.questions = shuffle(ALL_QUESTIONS).slice(0, TOTAL_ROUNDS);
    gameState.currentRound = 0;
    gameState.isFinalRound = false;
    gameState.status = 'playing';
    gameState.phase = 'story';
    gameState.roundAnswers = [];

    // Pick bonus rounds
    gameState.bonusRounds = new Set();
    const eligible = [];
    for (let i = 1; i < TOTAL_ROUNDS - 1; i++) eligible.push(i);
    const shuffled = shuffle(eligible);
    for (let i = 0; i < Math.min(5, shuffled.length); i++) gameState.bonusRounds.add(shuffled[i]);

    // Shuffle answers for first round
    gameState.answerMap = shuffle([0, 1, 2, 3]);

    broadcastGameState();
  }

  if (msg.type === 'advance') {
    if (gameState.status === 'scoreboard') {
      // Advance from scoreboard to next round
      gameState.status = 'playing';
      gameState.phase = 'story';
      gameState.roundAnswers = [];
      gameState.answerMap = shuffle([0, 1, 2, 3]);
      broadcastGameState();
    } else if (gameState.phase === 'story') {
      gameState.phase = 'choices';
      gameState.roundAnswers = [];
      gameState.answerMap = shuffle([0, 1, 2, 3]);

      // Start 40-second timer for team/individual modes
      if (gameState.scoringMode !== 'speed') {
        gameState.timerEnd = Date.now() + 40000;
        clearTimeout(gameState._timer);
        gameState._timer = setTimeout(() => {
          if (gameState.phase === 'choices') {
            gameState.phase = 'revealed';
            gameState.timerEnd = 0;
            broadcastGameState();
          }
        }, 40000);
      } else {
        gameState.timerEnd = 0;
      }

      broadcastGameState();
    } else if (gameState.phase === 'choices') {
      clearTimeout(gameState._timer);
      gameState.timerEnd = 0;
      gameState.phase = 'revealed';
      broadcastGameState();
    } else if (gameState.phase === 'revealed') {
      // Auto-award points to all teams with a correct answer, then finish round
      autoAwardPoints();
      finishRound();
    }
  }

  if (msg.type === 'lockWagers') {
    gameState.wagers = msg.wagers || [];
    gameState.isFinalRound = true;
    gameState.status = 'playing';
    gameState.phase = 'story';
    gameState.roundAnswers = [];
    gameState.answerMap = shuffle([0, 1, 2, 3]);
    broadcastGameState();
  }

  if (msg.type === 'resetGame') {
    gameState.status = 'lobby';
    gameState.phase = 'waiting';
    gameState.roomCode = generateRoomCode();
    gameState.players = [];
    gameState.teams = [];
    playerConnections.clear();
    broadcastGameState();
  }
}

function autoAwardPoints() {
  const q = gameState.questions[gameState.currentRound];
  if (!q) return;
  const isBonus = gameState.bonusRounds.has(gameState.currentRound);
  const basePts = isBonus ? 200 : 100;

  // Reset awards
  gameState.teams.forEach(t => { t._awarded = false; t._roundPts = 0; });

  // Find all correct answers sorted by time
  const correctAnswers = gameState.roundAnswers
    .filter(a => gameState.answerMap[a.answerIndex] === q.correct)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (gameState.scoringMode === 'speed') {
    // Only the first correct team gets points
    if (correctAnswers.length > 0) {
      const fastest = correctAnswers[0];
      gameState.teams[fastest.teamIndex]._awarded = true;
      gameState.teams[fastest.teamIndex]._roundPts = basePts;
    }
  } else if (gameState.scoringMode === 'individual') {
    // Each correct student adds points to their team
    correctAnswers.forEach(a => {
      gameState.teams[a.teamIndex]._awarded = true;
      gameState.teams[a.teamIndex]._roundPts += basePts;
    });
  } else {
    // 'team' mode — majority rules: the team's answer is what most players picked
    gameState.teams.forEach((t, teamIdx) => {
      const teamAnswers = gameState.roundAnswers.filter(a => a.teamIndex === teamIdx);
      if (teamAnswers.length === 0) return;

      // Count votes per answer
      const votes = {};
      teamAnswers.forEach(a => {
        votes[a.answerIndex] = (votes[a.answerIndex] || 0) + 1;
      });

      // Find the answer with the most votes
      let maxVotes = 0;
      let majorityAnswer = -1;
      let tied = false;
      for (const [ansIdx, count] of Object.entries(votes)) {
        if (count > maxVotes) {
          maxVotes = count;
          majorityAnswer = parseInt(ansIdx);
          tied = false;
        } else if (count === maxVotes) {
          tied = true;
        }
      }

      // If tied, no points. If majority answer is correct, award points.
      if (!tied && gameState.answerMap[majorityAnswer] === q.correct) {
        t._awarded = true;
        t._roundPts = basePts;
      }
    });
  }
}

function finishRound() {
  gameState.teams.forEach((t, i) => {
    if (t._awarded) {
      if (gameState.isFinalRound) {
        t.score += gameState.wagers[i] || 0;
      } else {
        t.score += t._roundPts || 0;
      }
      t.correctCount++;
    } else if (gameState.isFinalRound) {
      t.score -= gameState.wagers[i] || 0;
      if (t.score < 0) t.score = 0;
    }
    t._awarded = false;
    t._roundPts = 0;
  });

  gameState.currentRound++;

  if (gameState.currentRound >= TOTAL_ROUNDS) {
    gameState.status = 'finalResults';
    gameState.phase = 'waiting';
  } else if (gameState.currentRound === TOTAL_ROUNDS - 1 && !gameState.isFinalRound) {
    gameState.status = 'wager';
    gameState.phase = 'waiting';
  } else {
    gameState.status = 'scoreboard';
    gameState.phase = 'waiting';
  }

  broadcastGameState();

  // If scoreboard, auto-advance after teacher presses space (handled by teacher sending 'advance' from scoreboard)
}

// ========== HTTP SERVER ==========
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(TEACHER_HTML);
  } else if (pathname === '/play') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(PLAYER_HTML);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// ========== WEBSOCKET SERVER ==========
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const role = url.searchParams.get('role');

  if (role === 'teacher') {
    teacherWs = ws;
    broadcastGameState();

    ws.on('message', (data) => {
      try {
        handleTeacherMessage(JSON.parse(data));
      } catch(e) {}
    });

    ws.on('close', () => {
      if (teacherWs === ws) teacherWs = null;
    });
  } else if (role === 'player') {
    const name = url.searchParams.get('name') || 'Student';
    const teamIndex = parseInt(url.searchParams.get('team')) || 0;
    const roomCode = url.searchParams.get('room') || '';

    if (roomCode.toUpperCase() !== gameState.roomCode) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid room code' }));
      ws.close();
      return;
    }

    // Check if this is a reconnecting player (same name + team)
    let existingPlayer = gameState.players.find(p => p.name === name && p.teamIndex === teamIndex);
    let playerId;

    if (existingPlayer) {
      // Reconnect: reuse existing player
      playerId = existingPlayer.id;
      const oldWs = playerConnections.get(playerId);
      if (oldWs && oldWs.readyState <= 1) {
        try { oldWs.close(); } catch(e) {}
      }
      playerConnections.set(playerId, ws);
    } else {
      // New player
      playerId = nextPlayerId++;
      gameState.players.push({ id: playerId, name, teamIndex });
      playerConnections.set(playerId, ws);
    }

    ws.send(JSON.stringify({ type: 'joined', playerId, teamIndex, name }));
    broadcastGameState();

    ws.on('message', (data) => {
      try {
        handlePlayerMessage(playerId, JSON.parse(data));
      } catch(e) {}
    });

    ws.on('close', () => {
      // Don't remove player immediately — allow time for reconnect
      playerConnections.delete(playerId);
    });
  }
});

// ========== HEARTBEAT (keep connections alive) ==========
setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 25000);

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

// ========== GET LOCAL IP ==========
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n========================================');
  console.log('  HIDDEN IN PLAIN SIGHT');
  console.log('  Jackbox-Style Multiplayer Edition');
  console.log('========================================');
  console.log(`  Room Code: ${gameState.roomCode}`);
  console.log(`  Teacher:   http://localhost:${PORT}`);
  console.log(`  Students:  http://${ip}:${PORT}/play`);
  console.log('========================================\n');
});


// ========================================
// TEACHER HTML (Projected Screen)
// ========================================
const TEACHER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hidden in Plain Sight \u2014 Teacher Display</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #000000;
    --surface: rgba(255,255,255,0.05);
    --glass: rgba(255,255,255,0.08);
    --glass-border: rgba(255,255,255,0.1);
    --text: #f5f5f7;
    --text-secondary: rgba(255,255,255,0.55);
    --accent: #0A84FF;
    --accent-hover: #409CFF;
    --green: #30D158;
    --red: #FF453A;
    --orange: #FF9F0A;
    --label: rgba(255,255,255,0.35);
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
    background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  .screen { display: none; min-height: 100vh; flex-direction: column; }
  .screen.active { display: flex; }

  /* ===== LOBBY ===== */
  .lobby { justify-content: center; align-items: center; text-align: center; padding: 1.5rem 2rem; position: relative; overflow: hidden; min-height: 100vh; }
  .lobby::before {
    content: ''; position: absolute; top: -30%; left: 50%; transform: translateX(-50%);
    width: 140%; height: 60%; background: radial-gradient(ellipse, rgba(10,132,255,0.12) 0%, transparent 70%); pointer-events: none;
  }
  .lobby-header { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.25rem; position: relative; }
  .lobby-icon { font-size: 2.5rem; animation: pulse 4s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  .lobby-title { font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; }
  .lobby-subtitle { font-size: 1rem; color: var(--text-secondary); margin-bottom: 1rem; position: relative; }

  .join-strip {
    display: flex; align-items: center; justify-content: center; gap: 2rem;
    background: var(--glass); border: 1px solid var(--glass-border); border-radius: 24px;
    padding: 1.25rem 2.5rem; margin-bottom: 0.75rem; backdrop-filter: blur(20px); position: relative;
  }
  .join-strip-info { text-align: center; }
  .room-code-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 0.25rem; }
  .room-code { font-size: 3rem; font-weight: 800; letter-spacing: 0.3em; color: var(--accent); font-variant-numeric: tabular-nums; }
  .join-url { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.4rem; }
  .join-url strong { color: var(--text); word-break: break-all; }
  .qr-img { border-radius: 10px; background: #fff; padding: 6px; display: block; }

  .players-section { margin-bottom: 0.75rem; position: relative; min-height: 30px; }
  .players-label { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
  .player-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; max-width: 600px; }
  .player-chip {
    padding: 0.4rem 0.85rem; border-radius: 980px; font-size: 0.85rem; font-weight: 500;
    border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06);
  }

  /* Team setup in lobby */
  .team-setup { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 0.75rem; max-width: 700px; position: relative; }
  .team-count-row { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.75rem; position: relative; }
  .team-count-label { color: var(--text-secondary); font-size: 1rem; font-weight: 500; }
  .count-btn {
    width: 44px; height: 44px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 1rem; font-weight: 600; cursor: pointer;
  }
  .count-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
  .settings-row { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.75rem; position: relative; flex-wrap: wrap; }
  .settings-label { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; }
  .mode-btn {
    padding: 0.4rem 0.9rem; border-radius: 980px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 0.8rem; font-weight: 500; cursor: pointer;
  }
  .mode-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
  .team-card-mini {
    background: var(--glass); border: 1px solid var(--glass-border); border-radius: 12px; padding: 0.6rem 1.2rem;
    text-align: center; backdrop-filter: blur(20px); min-width: 120px;
  }
  .team-card-mini .emoji { font-size: 1.4rem; margin-bottom: 0.15rem; }
  .team-card-mini .name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.1rem; }
  .team-card-mini .count { font-size: 0.75rem; color: var(--text-secondary); }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.85rem 2rem; border: none; border-radius: 980px; font-family: inherit;
    font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em; position: relative;
  }
  .btn:active { transform: scale(0.97); }
  .btn-gold { background: var(--accent); color: white; }
  .btn-gold:hover { background: var(--accent-hover); }
  .btn-red { background: var(--red); color: white; }
  .btn-outline { background: var(--glass); color: var(--text); border: 1px solid var(--glass-border); }

  /* ===== GAME SCREEN ===== */
  .game-top-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.65rem 1.75rem; background: rgba(28,28,30,0.85);
    backdrop-filter: blur(30px); border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
  }
  .round-label { font-weight: 600; font-size: 0.95rem; letter-spacing: -0.01em; }
  .round-badge { padding: 0.2rem 0.7rem; border-radius: 980px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .round-badge.normal { background: rgba(255,255,255,0.08); color: var(--text-secondary); }
  .round-badge.bonus { background: rgba(255,69,58,0.18); color: var(--red); }
  .teacher-hint { font-size: 0.75rem; color: var(--label); }

  .scoreboard-strip {
    display: flex; justify-content: center; background: rgba(28,28,30,0.6);
    backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
  }
  .strip-team {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.55rem 1rem; transition: all 0.3s; position: relative;
  }
  .strip-team + .strip-team { border-left: 1px solid rgba(255,255,255,0.04); }
  .strip-emoji { font-size: 1.15rem; }
  .strip-name { font-weight: 500; font-size: 0.85rem; color: var(--text-secondary); }
  .strip-score { font-weight: 700; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .strip-team.leading { background: rgba(10,132,255,0.06); }
  .strip-team.leading .strip-score { color: var(--accent); }

  .answers-tracker {
    display: flex; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem;
    background: rgba(28,28,30,0.4); border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0; flex-wrap: wrap;
  }
  .answer-chip {
    padding: 0.25rem 0.65rem; border-radius: 8px; font-size: 0.75rem; font-weight: 500;
    animation: fadeIn 0.3s ease;
  }
  .answer-chip.correct { background: rgba(48,209,88,0.15); color: var(--green); }
  .answer-chip.wrong { background: rgba(255,69,58,0.12); color: var(--red); }
  .answer-chip.pending { background: rgba(255,255,255,0.06); color: var(--text-secondary); }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

  .game-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .game-scroll { flex: 1; overflow-y: auto; padding: 2rem 3rem; display: flex; flex-direction: column; gap: 1.5rem; }

  .story-card {
    background: rgba(28,28,30,0.7); backdrop-filter: blur(40px);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem 2.5rem;
    display: flex; gap: 2rem; align-items: flex-start;
  }
  .story-img { width: 220px; min-width: 220px; border-radius: 12px; object-fit: cover; max-height: 260px; }
  .story-body { flex: 1; }
  .story-header { display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .story-title { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; }
  .story-ref { font-size: 0.95rem; color: var(--text-secondary); }
  .story-text { font-size: 1.25rem; line-height: 1.7; color: rgba(255,255,255,0.85); }

  .question-text { font-size: 1.35rem; font-weight: 600; text-align: center; padding: 0.25rem 0; letter-spacing: -0.01em; }

  .answers-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .answer-option {
    display: flex; align-items: flex-start; gap: 0.85rem; padding: 1.2rem 1.4rem;
    background: rgba(28,28,30,0.6); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; font-size: 1.1rem; line-height: 1.55; backdrop-filter: blur(20px);
  }
  .answer-letter {
    display: flex; align-items: center; justify-content: center; min-width: 36px; height: 36px;
    border-radius: 10px; background: rgba(255,255,255,0.08); color: var(--text-secondary); font-weight: 700; font-size: 0.95rem; flex-shrink: 0;
  }
  .answer-option.correct { border-color: var(--green); background: rgba(48,209,88,0.1); }
  .answer-option.correct .answer-letter { background: var(--green); color: white; }
  .answer-option.wrong { opacity: 0.3; }

  .explanation-box {
    background: rgba(48,209,88,0.05); border: 1px solid rgba(48,209,88,0.15);
    border-radius: 18px; padding: 1.75rem 2rem; backdrop-filter: blur(20px);
  }
  .explanation-heading { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--green); margin-bottom: 0.6rem; }
  .explanation-body { font-size: 1.15rem; line-height: 1.7; color: rgba(255,255,255,0.85); }
  .explanation-verse { font-style: italic; color: var(--text-secondary); margin-top: 0.75rem; font-size: 1.05rem; }

  .teacher-controls {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    padding: 0.85rem 1.75rem; background: rgba(28,28,30,0.85); backdrop-filter: blur(30px);
    border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; flex-wrap: wrap;
  }
  .award-label { font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; }
  .award-team-btn {
    display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: rgba(255,255,255,0.06);
    color: var(--text); font-family: inherit; font-size: 0.9rem; font-weight: 500; cursor: pointer;
  }
  .award-team-btn.awarded { border-color: var(--green); background: rgba(48,209,88,0.12); color: var(--green); }
  .key-hint {
    display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px; padding: 0.1rem 0.4rem; font-size: 0.7rem;
    font-family: 'SF Mono', monospace; color: var(--label); margin-left: 0.25rem;
  }

  /* ===== SCOREBOARD ===== */
  .scoreboard-screen { justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem; }
  .sb-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
  .sb-subtitle { color: var(--text-secondary); margin-bottom: 2.5rem; font-size: 1.05rem; }
  .sb-teams { display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem; max-width: 900px; }
  .sb-team-card {
    background: rgba(28,28,30,0.7); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px; padding: 2rem 2.5rem; min-width: 190px; flex: 1; max-width: 240px;
    backdrop-filter: blur(20px); position: relative; transition: all 0.4s;
  }
  .sb-team-card.first { border-color: rgba(10,132,255,0.4); background: rgba(10,132,255,0.08); transform: scale(1.04); }
  .sb-emoji { font-size: 3.2rem; margin-bottom: 0.6rem; }
  .sb-name { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.4rem; }
  .sb-score { font-size: 2.8rem; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
  .sb-correct { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; }
  .crown { position: absolute; top: -12px; right: -8px; font-size: 1.8rem; animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }

  /* ===== WAGER ===== */
  .wager-screen { justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem; position: relative; }
  .wager-screen::before {
    content: ''; position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 140%; height: 50%; background: radial-gradient(ellipse, rgba(255,69,58,0.08) 0%, transparent 70%); pointer-events: none;
  }
  .wager-title { font-size: 2.5rem; font-weight: 700; color: var(--red); margin-bottom: 0.4rem; letter-spacing: -0.02em; position: relative; }
  .wager-subtitle { font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 2.5rem; position: relative; }
  .wager-teams { display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem; max-width: 900px; position: relative; }
  .wager-card {
    background: rgba(28,28,30,0.7); border: 1px solid rgba(255,69,58,0.2);
    border-radius: 22px; padding: 1.5rem 2rem; min-width: 180px; flex: 1; max-width: 220px; backdrop-filter: blur(20px);
  }
  .wager-emoji { font-size: 2.4rem; margin-bottom: 0.5rem; }
  .wager-name { font-weight: 600; margin-bottom: 0.2rem; }
  .wager-has { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
  .wager-input {
    width: 100%; padding: 0.55rem; border: 1px solid rgba(255,69,58,0.25); border-radius: 12px;
    background: rgba(255,255,255,0.06); color: var(--text); font-family: inherit;
    font-size: 1.2rem; font-weight: 700; text-align: center; outline: none;
  }
  .wager-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(255,69,58,0.2); }

  /* ===== FINAL ===== */
  .final-screen { justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem; position: relative; overflow: hidden; }
  .final-icon { font-size: 5rem; margin-bottom: 1.25rem; animation: pulse 3s ease-in-out infinite; position: relative; }
  .final-title { font-size: clamp(2rem,5vw,3.5rem); font-weight: 700; margin-bottom: 0.25rem; letter-spacing: -0.03em; position: relative; }
  .final-winner { font-size: clamp(1.3rem,3.5vw,2rem); color: var(--text-secondary); margin-bottom: 2rem; position: relative; font-weight: 500; }
  .final-message { font-size: 1.15rem; line-height: 1.7; max-width: 560px; font-style: italic; color: var(--text-secondary); margin-bottom: 2.5rem; position: relative; }

  .confetti-container { position: fixed; inset: 0; pointer-events: none; z-index: 999; overflow: hidden; }
  .confetti-piece { position: absolute; width: 10px; height: 10px; top: -10px; animation: confettiFall linear forwards; }
  @keyframes confettiFall { to { top: 110vh; transform: rotate(720deg); } }

  /* Responsive */
  @media (max-width: 900px) {
    .game-scroll { padding: 1.5rem; }
    .answers-list { grid-template-columns: 1fr; }
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
</style>
</head>
<body>
<div id="lobby" class="screen lobby active"></div>
<div id="game" class="screen"></div>
<div id="scoreboard" class="screen scoreboard-screen"></div>
<div id="wager" class="screen wager-screen"></div>
<div id="finalResults" class="screen final-screen"></div>
<div class="confetti-container" id="confetti"></div>

<script>
let ws;
let state = {};
let teamCountSetting = 3;
let scoringMode = 'team'; // 'team' | 'individual' | 'speed'

function connectTeacher() {
  ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/?role=teacher');
  ws.onmessage = (e) => {
    state = JSON.parse(e.data);
    render();
  };
  ws.onclose = () => {
    setTimeout(() => connectTeacher(), 2000);
  };
}
connectTeacher();

// Countdown timer tick
setInterval(() => {
  const td = document.getElementById('timerDisplay');
  if (td && state.timerEnd > 0) {
    const secs = Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
    td.textContent = secs + 's remaining';
  }
}, 1000);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault();
    if (state.status === 'scoreboard' || state.status === 'playing') {
      ws.send(JSON.stringify({ type: 'advance' }));
    }
  }
});

function render() {
  showScreen(state.status === 'playing' ? 'game' : state.status === 'lobby' ? 'lobby' : state.status);

  if (state.status === 'lobby') renderLobby();
  else if (state.status === 'playing') renderGame();
  else if (state.status === 'scoreboard') renderScoreboard();
  else if (state.status === 'wager') renderWager();
  else if (state.status === 'finalResults') renderFinal();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function renderLobby() {
  const el = document.getElementById('lobby');
  const teams = [];
  for (let i = 0; i < teamCountSetting; i++) {
    const presets = [
      { emoji: '\\u{1F981}', color: '#FF9F0A', name: 'Lions of Judah' },
      { emoji: '\\u26A1', color: '#0A84FF', name: 'Pillars of Fire' },
      { emoji: '\\u{1F30A}', color: '#64D2FF', name: 'Red Sea Walkers' },
      { emoji: '\\u{1F525}', color: '#BF5AF2', name: 'Burning Bush' }
    ];
    const p = presets[i];
    const count = (state.teamPlayerCounts && state.teamPlayerCounts[i]) || 0;
    teams.push('<div class="team-card-mini" style="border-color:' + p.color + '33"><div class="emoji">' + p.emoji + '</div><div class="name" style="color:' + p.color + '">' + p.name + '</div><div class="count">' + count + ' player' + (count !== 1 ? 's' : '') + '</div></div>');
  }

  const playerChips = (state.teams && state.teams.length > 0) ? '' :
    ((state.players || []).length > 0 ? '<div class="players-label">' + state.playerCount + ' player' + (state.playerCount !== 1 ? 's' : '') + ' joined</div>' : '<div class="players-label">Waiting for students to join...</div>');

  const playUrl = location.origin + '/play';
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(playUrl + '?room=' + (state.roomCode || ''));

  el.innerHTML =
    '<div class="lobby-header"><span class="lobby-icon">\\u{1F4DC}</span><h1 class="lobby-title">Hidden in Plain Sight</h1></div>' +
    '<p class="lobby-subtitle">Finding the Savior in the Old Testament</p>' +
    '<div class="join-strip">' +
      '<div class="join-strip-info"><div class="room-code-label">Room Code</div><div class="room-code">' + (state.roomCode || '') + '</div><div class="join-url">Join at <strong>' + playUrl + '</strong></div></div>' +
      '<img class="qr-img" src="' + qrUrl + '" alt="QR Code" width="150" height="150">' +
    '</div>' +
    '<div class="settings-row"><span class="settings-label">Teams:</span>' +
    [2,3,4].map(n => '<button class="count-btn' + (n === teamCountSetting ? ' active' : '') + '" onclick="setTeamCount(' + n + ')">' + n + '</button>').join('') +
    '</div>' +
    '<div class="settings-row"><span class="settings-label">Scoring:</span>' +
    [
      { id: 'team', label: 'Team (majority rules)' },
      { id: 'individual', label: 'Individual (100 pts per correct student)' },
      { id: 'speed', label: 'Speed (first correct team wins)' }
    ].map(m => '<button class="mode-btn' + (scoringMode === m.id ? ' active' : '') + '" onclick="setScoring(\\\'' + m.id + '\\\')">' + m.label + '</button>').join('') +
    '</div>' +
    '<div class="team-setup">' + teams.join('') + '</div>' +
    '<div class="players-section">' + playerChips + '</div>' +
    '<button class="btn btn-gold" onclick="startGame()" style="font-size:1.1rem;padding:1rem 2.5rem;">' +
    (state.playerCount > 0 ? 'Start Game (' + state.playerCount + ' players)' : 'Start Game') + '</button>';
}

function setTeamCount(n) {
  teamCountSetting = n;
  renderLobby();
}

function setScoring(mode) {
  scoringMode = mode;
  renderLobby();
}

function startGame() {
  const teamNames = [];
  for (let i = 0; i < teamCountSetting; i++) {
    const presets = ['Lions of Judah', 'Pillars of Fire', 'Red Sea Walkers', 'Burning Bush'];
    teamNames.push(presets[i]);
  }
  ws.send(JSON.stringify({ type: 'startGame', teamCount: teamCountSetting, teamNames, scoringMode }));
}

function renderGame() {
  const el = document.getElementById('game');
  const q = state.question;
  if (!q) return;

  const isBonus = state.bonusRounds && state.bonusRounds.includes(state.currentRound);
  const letters = ['A','B','C','D'];
  const topScore = Math.max(...(state.teams || []).map(t => t.score), 0);

  let html = '';

  // Top bar
  html += '<div class="game-top-bar">';
  html += '<span class="round-label">Round ' + (state.currentRound + 1) + ' / ' + state.totalRounds + '</span>';
  if (state.isFinalRound) html += '<span class="round-badge bonus">Final Wager</span>';
  else if (isBonus) html += '<span class="round-badge bonus">Double Points</span>';
  else html += '<span class="round-badge normal">Standard</span>';

  let hintText = '';
  if (state.phase === 'story') hintText = 'Press Space to show answers';
  else if (state.phase === 'choices') {
    if (state.timerEnd > 0) {
      const secs = Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
      hintText = '<span id="timerDisplay">' + secs + 's remaining</span> \u2014 Students answering...';
    } else {
      hintText = 'Students are answering... Press Space to reveal';
    }
  } else if (state.phase === 'revealed') hintText = 'Press Space for next round';
  html += '<span class="teacher-hint">' + hintText + '</span>';
  html += '</div>';

  // Score strip
  html += '<div class="scoreboard-strip">';
  (state.teams || []).forEach(t => {
    html += '<div class="strip-team' + (t.score === topScore && topScore > 0 ? ' leading' : '') + '">';
    html += '<span class="strip-emoji">' + t.emoji + '</span><span class="strip-name">' + t.name + '</span>';
    html += '<span class="strip-score">' + t.score + '</span></div>';
  });
  html += '</div>';

  // Answers tracker (who has answered)
  if (state.phase === 'choices' || state.phase === 'revealed') {
    html += '<div class="answers-tracker">';
    const answers = state.roundAnswers || [];
    if (answers.length === 0 && state.phase === 'choices') {
      html += '<span style="font-size:0.8rem;color:var(--text-secondary);">Waiting for answers...</span>';
    }
    answers.forEach(a => {
      const team = state.teams[a.teamIndex];
      let cls = 'pending';
      if (state.phase !== 'choices') cls = a.correct ? 'correct' : 'wrong';
      html += '<span class="answer-chip ' + cls + '" style="border:1px solid ' + (team?.color || '#fff') + '33">';
      html += (team?.emoji || '') + ' ' + a.playerName;
      if (state.phase !== 'choices') html += (a.correct ? ' \\u2713' : ' \\u2717');
      html += '</span>';
    });
    html += '</div>';
  }

  // Main content
  html += '<div class="game-content"><div class="game-scroll">';

  // Story card
  html += '<div class="story-card">';
  if (q.image) html += '<img class="story-img" src="' + q.image + '" alt="' + q.story + '">';
  html += '<div class="story-body"><div class="story-header">';
  html += '<span class="story-title">' + q.story + '</span>';
  html += '<span class="story-ref">' + q.reference + '</span></div>';
  html += '<div class="story-text">' + q.description + '</div></div></div>';

  // Choices
  if (state.phase !== 'story') {
    html += '<div class="question-text">' + q.question + '</div>';
    html += '<div class="answers-list">';
    state.answerMap.forEach((origIdx, dispIdx) => {
      let cls = '';
      if (state.phase === 'revealed') {
        cls = origIdx === q.correct ? 'correct' : 'wrong';
      }
      html += '<div class="answer-option ' + cls + '">';
      html += '<span class="answer-letter">' + letters[dispIdx] + '</span>';
      html += '<span>' + q.answers[origIdx] + '</span></div>';
    });
    html += '</div>';
  }

  // Explanation
  if (state.phase === 'revealed') {
    html += '<div class="explanation-box">';
    html += '<div class="explanation-heading">The Connection to Christ</div>';
    html += '<div class="explanation-body">' + q.explanation + '</div>';
    html += '<div class="explanation-verse">' + q.scripture + '</div></div>';
  }

  html += '</div></div>';

  // Teacher controls
  html += '<div class="teacher-controls">';
  const actionLabels = { story: 'Show answers', choices: 'Reveal answer', revealed: 'Next round' };
  html += '<button class="btn btn-gold" onclick="advance()" style="padding:0.6rem 1.5rem;font-size:0.9rem;">' +
    (actionLabels[state.phase] || 'Next') + ' <span class="key-hint">Space</span></button>';
  html += '</div>';

  el.innerHTML = html;
}

function advance() {
  ws.send(JSON.stringify({ type: 'advance' }));
}

function renderScoreboard() {
  const el = document.getElementById('scoreboard');
  const sorted = [...(state.teams || [])].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score || 0;
  const nextIsBonus = state.bonusRounds && state.bonusRounds.includes(state.currentRound);

  let html = '<div class="sb-title">After Round ' + state.currentRound + '</div>';
  html += '<p class="sb-subtitle">' + (nextIsBonus ? 'Next round is DOUBLE POINTS!' : (state.totalRounds - state.currentRound) + ' rounds remaining') + '</p>';
  html += '<div class="sb-teams">';
  sorted.forEach((t, i) => {
    html += '<div class="sb-team-card' + (i === 0 && topScore > 0 ? ' first' : '') + '" style="border-color:' + t.color + '44">';
    if (i === 0 && topScore > 0) html += '<div class="crown">\\u{1F451}</div>';
    html += '<div class="sb-emoji">' + t.emoji + '</div>';
    html += '<div class="sb-name">' + t.name + '</div>';
    html += '<div class="sb-score" style="color:' + t.color + '">' + t.score + '</div>';
    html += '<div class="sb-correct">' + t.correctCount + ' correct</div></div>';
  });
  html += '</div>';
  html += '<button class="btn btn-gold" onclick="advance()" style="font-size:1.1rem;padding:1rem 2.5rem;">Next Round <span class="key-hint">Space</span></button>';
  el.innerHTML = html;
}

function renderWager() {
  const el = document.getElementById('wager');
  let html = '<div class="wager-title">Final Round Wager</div>';
  html += '<p class="wager-subtitle">Each team wagers up to their current score on the final question!</p>';
  html += '<div class="wager-teams">';
  (state.teams || []).forEach((t, i) => {
    html += '<div class="wager-card" style="border-color:' + t.color + '44">';
    html += '<div class="wager-emoji">' + t.emoji + '</div>';
    html += '<div class="wager-name">' + t.name + '</div>';
    html += '<div class="wager-has">Current: ' + t.score + '</div>';
    html += '<input class="wager-input" id="wager-' + i + '" type="number" min="0" max="' + t.score + '" placeholder="0" style="color:' + t.color + '" onfocus="this.select()">';
    html += '</div>';
  });
  html += '</div>';
  html += '<button class="btn btn-red" onclick="lockWagers()">Lock In Wagers &amp; Go</button>';
  el.innerHTML = html;
}

function lockWagers() {
  const wagers = [];
  (state.teams || []).forEach((t, i) => {
    const el = document.getElementById('wager-' + i);
    let val = parseInt(el?.value) || 0;
    if (val < 0) val = 0;
    if (val > t.score) val = t.score;
    wagers.push(val);
  });
  ws.send(JSON.stringify({ type: 'lockWagers', wagers }));
}

function renderFinal() {
  const el = document.getElementById('finalResults');
  const sorted = [...(state.teams || [])].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  let html = '<div class="final-icon">\\u{1F3C6}</div>';
  html += '<h2 class="final-title">Game Over!</h2>';
  html += '<p class="final-winner">' + (winner?.emoji || '') + ' ' + (winner?.name || '') + ' wins with ' + (winner?.score || 0) + ' points!</p>';
  html += '<div class="sb-teams" style="margin-bottom:2rem">';
  sorted.forEach((t, i) => {
    html += '<div class="sb-team-card' + (i === 0 ? ' first' : '') + '" style="border-color:' + t.color + '44">';
    if (i === 0) html += '<div class="crown">\\u{1F451}</div>';
    html += '<div class="sb-emoji">' + t.emoji + '</div>';
    html += '<div class="sb-name">' + t.name + '</div>';
    html += '<div class="sb-score" style="color:' + t.color + '">' + t.score + '</div>';
    html += '<div class="sb-correct">' + t.correctCount + ' of ' + state.totalRounds + ' correct</div></div>';
  });
  html += '</div>';
  html += '<p class="final-message">Every story in the Old Testament can teach us about Jesus Christ. The more you look for Him, the more you\\u2019ll find Him \\u2014 in every book, every page, every verse.</p>';
  html += '<button class="btn btn-gold" onclick="location.reload()">Play Again</button>';
  el.innerHTML = html;

  launchConfetti();
}

let confettiLaunched = false;
function launchConfetti() {
  if (confettiLaunched) return;
  confettiLaunched = true;
  const container = document.getElementById('confetti');
  const colors = ['#0A84FF', '#30D158', '#FF9F0A', '#FF453A', '#BF5AF2', '#64D2FF', '#FFD60A'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (2 + Math.random() * 3) + 's';
    p.style.animationDelay = Math.random() * 2 + 's';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (6 + Math.random() * 8) + 'px';
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(p);
  }
  setTimeout(() => container.innerHTML = '', 6000);
}
</script>
</body>
</html>`;


// ========================================
// PLAYER HTML (Phone Interface)
// ========================================
const PLAYER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Hidden in Plain Sight \u2014 Join</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #000; --text: #f5f5f7; --text2: rgba(255,255,255,0.55);
    --accent: #0A84FF; --green: #30D158; --red: #FF453A; --orange: #FF9F0A;
    --glass: rgba(255,255,255,0.08); --glass-border: rgba(255,255,255,0.1);
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
    background: var(--bg); color: var(--text); min-height: 100dvh;
    -webkit-font-smoothing: antialiased; overflow-x: hidden;
  }
  .screen { display: none; min-height: 100dvh; flex-direction: column; }
  .screen.active { display: flex; }

  /* ===== JOIN ===== */
  .join-screen {
    justify-content: center; align-items: center; text-align: center; padding: 2rem 1.5rem;
  }
  .join-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.3rem; letter-spacing: -0.02em; }
  .join-subtitle { color: var(--text2); margin-bottom: 2rem; font-size: 0.95rem; }

  .join-form { width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 1rem; }
  .form-group { text-align: left; }
  .form-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text2); margin-bottom: 0.4rem; display: block; }
  .form-input {
    width: 100%; padding: 0.85rem 1rem; border: 1px solid rgba(255,255,255,0.15);
    border-radius: 14px; background: rgba(255,255,255,0.06); color: var(--text);
    font-family: inherit; font-size: 1.1rem; font-weight: 600; outline: none;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(10,132,255,0.25); }
  .form-input.code { text-align: center; font-size: 1.8rem; letter-spacing: 0.3em; text-transform: uppercase; }

  .team-picker { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .team-pick-btn {
    padding: 1rem; border-radius: 16px; border: 2px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); cursor: pointer; text-align: center;
    transition: all 0.2s; -webkit-tap-highlight-color: transparent;
  }
  .team-pick-btn.selected { border-color: var(--accent); background: rgba(10,132,255,0.1); }
  .team-pick-btn .t-emoji { font-size: 1.8rem; margin-bottom: 0.3rem; }
  .team-pick-btn .t-name { font-size: 0.85rem; font-weight: 600; }
  .team-pick-btn .t-count { font-size: 0.7rem; color: var(--text2); }

  .join-btn {
    width: 100%; padding: 1rem; border: none; border-radius: 980px;
    background: var(--accent); color: white; font-family: inherit;
    font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem;
    -webkit-tap-highlight-color: transparent;
  }
  .join-btn:disabled { opacity: 0.4; cursor: default; }

  .error-msg { color: var(--red); font-size: 0.85rem; margin-top: 0.5rem; }

  /* ===== WAITING ===== */
  .waiting-screen {
    justify-content: center; align-items: center; text-align: center; padding: 2rem 1.5rem;
  }
  .waiting-emoji { font-size: 4rem; margin-bottom: 1rem; animation: bob 3s ease-in-out infinite; }
  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .waiting-text { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; }
  .waiting-sub { color: var(--text2); font-size: 0.95rem; }

  /* ===== PLAY (in-game phone view) ===== */
  .play-screen { padding: 0; }
  .play-header {
    padding: 0.75rem 1rem; background: rgba(28,28,30,0.85);
    backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
  }
  .play-round { font-weight: 600; font-size: 0.85rem; }
  .play-team { font-size: 0.85rem; color: var(--text2); }
  .play-badge { padding: 0.15rem 0.5rem; border-radius: 980px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
  .play-badge.bonus { background: rgba(255,69,58,0.18); color: var(--red); }

  .play-scores {
    display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    background: rgba(28,28,30,0.5); flex-shrink: 0;
  }
  .play-score-item {
    flex: 1; padding: 0.4rem 0.5rem; text-align: center; font-size: 0.75rem;
    border-right: 1px solid rgba(255,255,255,0.04);
  }
  .play-score-item:last-child { border-right: none; }
  .play-score-item .ps-emoji { font-size: 0.85rem; }
  .play-score-item .ps-score { font-weight: 700; font-variant-numeric: tabular-nums; }

  .play-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

  .play-story-label {
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--accent); margin-bottom: 0.25rem;
  }
  .play-story-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: -0.01em; }

  .play-timer { font-size: 1.5rem; font-weight: 800; color: var(--accent); text-align: center; margin-bottom: 0.5rem; font-variant-numeric: tabular-nums; }
  .play-question { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }

  .play-answers { display: flex; flex-direction: column; gap: 0.6rem; }
  .play-answer-btn {
    display: flex; align-items: flex-start; gap: 0.75rem; width: 100%;
    padding: 1rem 1.1rem; border: 2px solid rgba(255,255,255,0.1);
    border-radius: 14px; background: rgba(255,255,255,0.04); color: var(--text);
    font-family: inherit; font-size: 0.95rem; font-weight: 400; text-align: left;
    cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; line-height: 1.4;
  }
  .play-answer-btn:active { transform: scale(0.98); }
  .play-answer-btn .letter {
    display: flex; align-items: center; justify-content: center; min-width: 30px; height: 30px;
    border-radius: 8px; background: rgba(255,255,255,0.08); font-weight: 700; font-size: 0.85rem;
    flex-shrink: 0; color: var(--text2);
  }
  .play-answer-btn.selected { border-color: var(--accent); background: rgba(10,132,255,0.1); }
  .play-answer-btn.selected .letter { background: var(--accent); color: white; }
  .play-answer-btn.correct { border-color: var(--green); background: rgba(48,209,88,0.1); }
  .play-answer-btn.correct .letter { background: var(--green); color: white; }
  .play-answer-btn.wrong { opacity: 0.3; }
  .play-answer-btn.my-wrong { border-color: var(--red); background: rgba(255,69,58,0.1); opacity: 1; }
  .play-answer-btn.my-wrong .letter { background: var(--red); color: white; }
  .play-answer-btn:disabled { cursor: default; }

  .play-answered {
    text-align: center; padding: 1.5rem; color: var(--text2); font-size: 0.95rem;
  }
  .play-answered .check { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--green); }

  .play-explanation {
    background: rgba(48,209,88,0.05); border: 1px solid rgba(48,209,88,0.15);
    border-radius: 14px; padding: 1.25rem;
  }
  .play-explanation h4 { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--green); margin-bottom: 0.4rem; }
  .play-explanation p { font-size: 0.9rem; line-height: 1.6; color: rgba(255,255,255,0.85); }
  .play-explanation .verse { font-style: italic; color: var(--text2); margin-top: 0.5rem; font-size: 0.85rem; }

  .result-banner {
    text-align: center; padding: 1rem; border-radius: 14px; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;
  }
  .result-banner.correct-banner { background: rgba(48,209,88,0.1); color: var(--green); border: 1px solid rgba(48,209,88,0.2); }
  .result-banner.wrong-banner { background: rgba(255,69,58,0.1); color: var(--red); border: 1px solid rgba(255,69,58,0.2); }
</style>
</head>
<body>
<div id="joinScreen" class="screen join-screen active"></div>
<div id="waitingScreen" class="screen waiting-screen"></div>
<div id="playScreen" class="screen play-screen"></div>
<div id="finalScreen" class="screen waiting-screen"></div>

<script>
let ws = null;
let myState = {};
let joined = false;
let selectedTeam = 0;
let joinParams = {}; // saved for reconnect

// On load, render join form
renderJoin();

function renderJoin() {
  const el = document.getElementById('joinScreen');
  el.innerHTML =
    '<h1 class="join-title">\\u{1F4DC} Hidden in Plain Sight</h1>' +
    '<p class="join-subtitle">Enter the room code on the screen</p>' +
    '<div class="join-form">' +
      '<div class="form-group">' +
        '<label class="form-label">Room Code</label>' +
        '<input class="form-input code" id="roomCode" maxlength="4" placeholder="ABCD" autocomplete="off">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Your Name</label>' +
        '<input class="form-input" id="playerName" placeholder="Enter your name" autocomplete="off">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Pick Your Team</label>' +
        '<div class="team-picker" id="teamPicker"></div>' +
      '</div>' +
      '<button class="join-btn" id="joinBtn" onclick="joinGame()">Join Game</button>' +
      '<div class="error-msg" id="errorMsg"></div>' +
    '</div>';

  renderTeamPicker();

  document.getElementById('roomCode').addEventListener('input', function() {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });

  // Auto-fill room code from URL query param
  const urlRoom = new URLSearchParams(window.location.search).get('room');
  if (urlRoom) {
    document.getElementById('roomCode').value = urlRoom.toUpperCase();
  }
}

function renderTeamPicker() {
  const presets = [
    { emoji: '\\u{1F981}', color: '#FF9F0A', name: 'Lions of Judah' },
    { emoji: '\\u26A1', color: '#0A84FF', name: 'Pillars of Fire' },
    { emoji: '\\u{1F30A}', color: '#64D2FF', name: 'Red Sea Walkers' },
    { emoji: '\\u{1F525}', color: '#BF5AF2', name: 'Burning Bush' }
  ];

  const picker = document.getElementById('teamPicker');
  if (!picker) return;
  picker.innerHTML = presets.map((p, i) =>
    '<div class="team-pick-btn' + (selectedTeam === i ? ' selected' : '') + '" onclick="pickTeam(' + i + ')" style="' + (selectedTeam === i ? 'border-color:' + p.color : '') + '">' +
    '<div class="t-emoji">' + p.emoji + '</div>' +
    '<div class="t-name" style="color:' + p.color + '">' + p.name + '</div></div>'
  ).join('');
}

function pickTeam(i) {
  selectedTeam = i;
  renderTeamPicker();
}

function joinGame() {
  const code = document.getElementById('roomCode').value.trim();
  const name = document.getElementById('playerName').value.trim();
  const errEl = document.getElementById('errorMsg');

  if (!code || code.length < 4) { errEl.textContent = 'Enter the 4-letter room code'; return; }
  if (!name) { errEl.textContent = 'Enter your name'; return; }
  errEl.textContent = '';

  joinParams = { name, code, team: selectedTeam };
  connectPlayer();
}

function connectPlayer() {
  const { name, code, team } = joinParams;
  ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/?role=player&name=' + encodeURIComponent(name) + '&team=' + team + '&room=' + encodeURIComponent(code));

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'error') {
      const errEl = document.getElementById('errorMsg');
      if (errEl) errEl.textContent = msg.message;
      return;
    }
    if (msg.type === 'joined') {
      joined = true;
    }
    if (msg.type === 'gameState') {
      myState = msg;
      renderPlayerView();
    }
  };

  ws.onclose = () => {
    if (joined) {
      // Auto-reconnect after 2 seconds
      setTimeout(() => connectPlayer(), 2000);
    }
  };
}

function renderPlayerView() {
  const s = myState;

  if (s.status === 'lobby') {
    showPlayerScreen('waitingScreen');
    document.getElementById('waitingScreen').innerHTML =
      '<div class="waiting-emoji">' + (s.teamEmoji || '\\u{1F4DC}') + '</div>' +
      '<div class="waiting-text" style="color:' + (s.teamColor || '#fff') + '">You\\u2019re on ' + (s.teamName || 'a team') + '!</div>' +
      '<div class="waiting-sub">Waiting for the teacher to start the game...</div>';
    return;
  }

  if (s.status === 'finalResults') {
    showPlayerScreen('finalScreen');
    const sorted = [...(s.teams || [])].sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    document.getElementById('finalScreen').innerHTML =
      '<div class="waiting-emoji">\\u{1F3C6}</div>' +
      '<div class="waiting-text">Game Over!</div>' +
      '<div class="waiting-sub">' + (winner?.emoji || '') + ' ' + (winner?.name || '') + ' wins with ' + (winner?.score || 0) + ' points!</div>';
    return;
  }

  if (s.status === 'scoreboard' || s.status === 'wager') {
    showPlayerScreen('waitingScreen');
    const sorted = [...(s.teams || [])].sort((a, b) => b.score - a.score);
    let html = '<div class="waiting-emoji">\\u{1F4CA}</div>';
    html += '<div class="waiting-text">Scoreboard</div>';
    sorted.forEach(t => {
      html += '<div style="font-size:1.1rem;margin:0.3rem 0;">' + t.emoji + ' ' + t.name + ': <strong style="color:' + t.color + '">' + t.score + '</strong></div>';
    });
    if (s.status === 'wager') html += '<div class="waiting-sub" style="margin-top:1rem;color:var(--red)">Final Wager Round Coming...</div>';
    else html += '<div class="waiting-sub" style="margin-top:1rem;">Next round starting soon...</div>';
    document.getElementById('waitingScreen').innerHTML = html;
    return;
  }

  // Playing
  showPlayerScreen('playScreen');
  renderPlayView();
}

function showPlayerScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function renderPlayView() {
  const s = myState;
  const el = document.getElementById('playScreen');
  const letters = ['A','B','C','D'];

  let html = '';

  // Header
  html += '<div class="play-header">';
  html += '<span class="play-round">Round ' + (s.currentRound + 1) + '/' + s.totalRounds + '</span>';
  if (s.isFinalRound) html += '<span class="play-badge bonus">Final Wager</span>';
  else if (s.isBonus) html += '<span class="play-badge bonus">2x Points</span>';
  html += '<span class="play-team">' + (s.teamEmoji || '') + ' ' + (s.teamName || '') + '</span>';
  html += '</div>';

  // Mini scores
  html += '<div class="play-scores">';
  (s.teams || []).forEach(t => {
    html += '<div class="play-score-item"><span class="ps-emoji">' + t.emoji + '</span> <span class="ps-score">' + t.score + '</span></div>';
  });
  html += '</div>';

  // Body
  html += '<div class="play-body">';

  if (s.phase === 'story') {
    html += '<div class="play-story-label">Read Along</div>';
    html += '<div class="play-story-title">' + (s.storyTitle || '') + '</div>';
    html += '<div style="color:var(--text2);font-size:0.9rem;text-align:center;margin-top:2rem;">The teacher is reading the story aloud.\\nAnswers will appear on your phone shortly...</div>';
  }

  if (s.phase === 'choices') {
    if (s.hasAnswered || s.teamLocked) {
      const msg = s.teamLocked && !s.hasAnswered ? (s.teamLockedBy + ' answered for your team!') : 'Answer locked in!';
      html += '<div class="play-answered"><div class="check">\\u2713</div>' + msg + '<br><span style="font-size:0.85rem;">Waiting for the teacher to reveal...</span></div>';
    } else {
      if (s.timerEnd > 0) {
        const secs = Math.max(0, Math.ceil((s.timerEnd - Date.now()) / 1000));
        html += '<div class="play-timer" id="playerTimer">' + secs + 's</div>';
      }
      html += '<div class="play-question">' + (s.question || '') + '</div>';
      html += '<div class="play-answers">';
      (s.answers || []).forEach((a, i) => {
        html += '<button class="play-answer-btn" onclick="submitAnswer(' + i + ')">';
        html += '<span class="letter">' + letters[i] + '</span><span>' + a + '</span></button>';
      });
      html += '</div>';
    }
  }

  if (s.phase === 'revealed') {
    const correctIdx = s.correctIndex;
    const myAnswer = s.myAnswer;
    const gotIt = myAnswer === correctIdx;

    if (myAnswer !== undefined) {
      html += '<div class="result-banner ' + (gotIt ? 'correct-banner' : 'wrong-banner') + '">' +
        (gotIt ? '\\u2713 Correct!' : '\\u2717 Not quite!') + '</div>';
    }

    html += '<div class="play-question">' + (s.question || '') + '</div>';
    html += '<div class="play-answers">';
    (s.answers || []).forEach((a, i) => {
      let cls = 'play-answer-btn';
      if (i === correctIdx) cls += ' correct';
      else if (i === myAnswer && i !== correctIdx) cls += ' my-wrong';
      else cls += ' wrong';
      html += '<button class="' + cls + '" disabled>';
      html += '<span class="letter">' + letters[i] + '</span><span>' + a + '</span></button>';
    });
    html += '</div>';

    if (s.explanation) {
      html += '<div class="play-explanation">';
      html += '<h4>The Connection to Christ</h4>';
      html += '<p>' + s.explanation + '</p>';
      if (s.scripture) html += '<div class="verse">' + s.scripture + '</div>';
      html += '</div>';
    }
  }

  html += '</div>';
  el.innerHTML = html;
}

function submitAnswer(idx) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: 'answer', answerIndex: idx }));
  }
}

// Player countdown timer
setInterval(() => {
  const td = document.getElementById('playerTimer');
  if (td && myState && myState.timerEnd > 0) {
    const secs = Math.max(0, Math.ceil((myState.timerEnd - Date.now()) / 1000));
    td.textContent = secs + 's';
  }
}, 1000);
</script>
</body>
</html>`;
