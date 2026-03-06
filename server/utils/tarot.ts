export interface TarotCard {
    id: number
    key: string
    name: string
    nameRu: string
    image: string
    keywords: string[]
    keywordsRu: string[]
    meaning: string
    meaningRu: string
}

export const MAJOR_ARCANA: TarotCard[] = [
    {
        id: 0, key: 'fool', name: 'The Fool', nameRu: 'Шут', image: '/tarot/fool.png',
        keywords: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
        keywordsRu: ['новые начинания', 'невинность', 'спонтанность', 'свободный дух'],
        meaning: 'The Fool represents the very beginning of a journey — a leap of faith into the unknown. It symbolizes pure potential, childlike wonder, and the courage to start something without knowing the outcome. The Fool carries no baggage from the past and approaches life with fresh eyes. In questions about decisions, it encourages taking a risk and trusting the process. In relationships, it can mean a new chapter or a need to approach love without preconceptions. As a challenge, it warns against naivety or recklessness. The card\'s core message: sometimes you must step off the cliff to discover you can fly.',
        meaningRu: 'Шут — это самое начало пути, прыжок веры в неизвестность. Он символизирует чистый потенциал, детское удивление и смелость начать что-то новое, не зная исхода. Шут не несёт груза прошлого и смотрит на мир свежим взглядом. В вопросах о решениях он призывает рискнуть и довериться процессу. В отношениях может означать новую главу или потребность подойти к любви без предубеждений. Как препятствие — предупреждает о наивности или безрассудстве. Главное послание карты: иногда нужно шагнуть в пропасть, чтобы узнать, что вы умеете летать.',
    },
    {
        id: 1, key: 'magician', name: 'The Magician', nameRu: 'Маг', image: '/tarot/magician.png',
        keywords: ['willpower', 'manifestation', 'resourcefulness', 'skill'],
        keywordsRu: ['сила воли', 'проявление', 'находчивость', 'мастерство'],
        meaning: 'The Magician represents mastery, skill, and the power to shape reality through focused intention. All four elements (cups, wands, swords, pentacles) are at his disposal — he has everything he needs. This card says "you already have the tools; now use them." In career questions, it points to talent and competence. In relationships, it speaks of charm and conscious effort to create connection. As a challenge, it can warn of manipulation or scattered energy. The Magician channels willpower into action — the bridge between desire and manifestation.',
        meaningRu: 'Маг олицетворяет мастерство, талант и силу формировать реальность через сфокусированное намерение. Все четыре стихии (кубки, жезлы, мечи, пентакли) в его распоряжении — у него есть всё необходимое. Эта карта говорит: «У тебя уже есть инструменты — используй их». В карьерных вопросах указывает на компетентность и талант. В отношениях говорит об обаянии и осознанном усилии создать связь. Как препятствие — может предупреждать о манипуляции или распылении энергии. Маг направляет волю в действие — он мост между желанием и воплощением.',
    },
    {
        id: 2, key: 'high_priestess', name: 'The High Priestess', nameRu: 'Верховная Жрица', image: '/tarot/high_priestess.png',
        keywords: ['intuition', 'mystery', 'inner knowledge', 'subconscious'],
        keywordsRu: ['интуиция', 'тайна', 'внутреннее знание', 'подсознание'],
        meaning: 'The High Priestess is the guardian of the unconscious mind and hidden knowledge. She sits between the pillars of light and darkness, representing the threshold between the seen and unseen worlds. This card urges you to trust your intuition over logic — the answer you seek is already within you. In relationships, she suggests secrets or unspoken feelings that need acknowledgment. In career, she advises patience and listening before acting. As a challenge, she warns against ignoring your gut feeling or being deceived by surface appearances. Her message: be still, listen inward, and the truth will reveal itself.',
        meaningRu: 'Верховная Жрица — хранительница бессознательного и скрытого знания. Она сидит между столпами света и тьмы, олицетворяя порог между видимым и невидимым мирами. Эта карта призывает доверять интуиции больше, чем логике — ответ, который вы ищете, уже внутри вас. В отношениях указывает на тайны или невысказанные чувства, которые нужно признать. В карьере советует проявить терпение и выслушать, прежде чем действовать. Как препятствие — предупреждает об игнорировании внутреннего голоса или обмане поверхностными впечатлениями. Её послание: замрите, прислушайтесь к себе, и истина откроется сама.',
    },
    {
        id: 3, key: 'empress', name: 'The Empress', nameRu: 'Императрица', image: '/tarot/empress.png',
        keywords: ['femininity', 'abundance', 'nurturing', 'nature'],
        keywordsRu: ['женственность', 'изобилие', 'забота', 'природа'],
        meaning: 'The Empress embodies abundance, fertility, and the nurturing force of nature. She represents creation in all forms — artistic projects, relationships, family, and material prosperity. This card signals a period of growth and fruition where your efforts bear fruit. In love, she speaks of deep sensuality, devotion, and emotional richness. In career, she points to creative projects flourishing. As a challenge, she may warn of over-giving, smothering, or neglecting self-care while caring for others. Her message: connect with your senses, nurture what you love, and trust in the natural flow of abundance.',
        meaningRu: 'Императрица воплощает изобилие, плодородие и питающую силу природы. Она олицетворяет творение во всех формах — творческие проекты, отношения, семью и материальное процветание. Эта карта сигнализирует о периоде роста и созревания, когда ваши усилия приносят плоды. В любви говорит о глубокой чувственности, преданности и эмоциональной полноте. В карьере указывает на расцвет творческих проектов. Как препятствие — может предупреждать о чрезмерной самоотдаче, удушающей заботе или пренебрежении собой ради других. Её послание: соединитесь со своими чувствами, питайте то, что любите, и доверьтесь естественному потоку изобилия.',
    },
    {
        id: 4, key: 'emperor', name: 'The Emperor', nameRu: 'Император', image: '/tarot/emperor.png',
        keywords: ['authority', 'structure', 'stability', 'leadership'],
        keywordsRu: ['власть', 'структура', 'стабильность', 'лидерство'],
        meaning: 'The Emperor represents authority, structure, and the power of discipline. He is the father archetype — providing stability, setting boundaries, and creating order from chaos. This card calls for taking control of your situation through planning and rational decision-making. In career, it signals leadership opportunities or the need for strategic thinking. In relationships, it speaks of commitment, protection, and reliability — but also potential rigidity. As a challenge, it warns against being too controlling, inflexible, or emotionally distant. His message: build a solid foundation through discipline, but remember that true strength includes knowing when to yield.',
        meaningRu: 'Император олицетворяет власть, структуру и силу дисциплины. Он — архетип отца: обеспечивает стабильность, устанавливает границы и создаёт порядок из хаоса. Эта карта призывает взять ситуацию под контроль через планирование и рациональные решения. В карьере сигнализирует о возможностях лидерства или необходимости стратегического мышления. В отношениях говорит о надёжности, преданности и защите — но также о возможной жёсткости. Как препятствие — предупреждает о чрезмерном контроле, негибкости или эмоциональной отстранённости. Его послание: создайте прочный фундамент через дисциплину, но помните — истинная сила включает умение уступать.',
    },
    {
        id: 5, key: 'hierophant', name: 'The Hierophant', nameRu: 'Иерофант', image: '/tarot/hierophant.png',
        keywords: ['tradition', 'spirituality', 'wisdom', 'conformity'],
        keywordsRu: ['традиция', 'духовность', 'мудрость', 'следование нормам'],
        meaning: 'The Hierophant represents tradition, spiritual guidance, and established wisdom. He is the bridge between the divine and the mundane — a teacher, mentor, or institution that provides structure for growth. This card may point to formal education, religious or spiritual practices, or following a proven path. In relationships, it can signify commitment ceremonies, shared values, or seeking counsel. In career, it suggests learning from mentors or working within established systems. As a challenge, it warns against blind conformity, dogma, or refusing to question authority. His message: honor the wisdom of those who came before, but find your own spiritual truth within that tradition.',
        meaningRu: 'Иерофант представляет традицию, духовное наставничество и устоявшуюся мудрость. Он — мост между божественным и земным: учитель, наставник или институт, дающий структуру для роста. Эта карта может указывать на формальное обучение, духовные практики или следование проверенному пути. В отношениях может означать церемонии, общие ценности или обращение за советом. В карьере — обучение у наставников или работу в рамках устоявшихся систем. Как препятствие — предупреждает о слепом конформизме, догматизме или отказе ставить под сомнение авторитеты. Его послание: чтите мудрость предшественников, но находите собственную духовную истину.',
    },
    {
        id: 6, key: 'lovers', name: 'The Lovers', nameRu: 'Влюблённые', image: '/tarot/lovers.png',
        keywords: ['love', 'harmony', 'choices', 'alignment'],
        keywordsRu: ['любовь', 'гармония', 'выбор', 'единение'],
        meaning: 'The Lovers is not only about romantic love — it is fundamentally about choice, alignment of values, and the union of opposites. It represents a crossroads where you must choose based on your deepest values, not external pressure. In love, it signals a profound connection, soulmate energy, or a critical relationship decision. In career, it points to choices that must align with your authentic self. As a challenge, it warns of temptation, indecision, or making choices that betray your values. The deeper message: true union — whether with another person, a path, or yourself — requires honest alignment between head and heart.',
        meaningRu: 'Влюблённые — это не только о романтической любви. Эта карта прежде всего о выборе, совпадении ценностей и союзе противоположностей. Она представляет перекрёсток, где нужно выбирать, опираясь на глубинные ценности, а не внешнее давление. В любви сигнализирует о глубокой связи, энергии родственной души или ключевом решении в отношениях. В карьере указывает на выбор, который должен соответствовать вашему подлинному «я». Как препятствие — предупреждает об искушении, нерешительности или выборе, предающем ваши ценности. Глубинное послание: истинный союз — с другим человеком, путём или самим собой — требует честного совпадения разума и сердца.',
    },
    {
        id: 7, key: 'chariot', name: 'The Chariot', nameRu: 'Колесница', image: '/tarot/chariot.png',
        keywords: ['determination', 'willpower', 'triumph', 'control'],
        keywordsRu: ['решимость', 'сила воли', 'триумф', 'контроль'],
        meaning: 'The Chariot represents victory through determination and willpower. The charioteer controls two opposing forces (often shown as black and white sphinxes) — symbolizing the mastery of conflicting emotions or circumstances. This card appears when you need to stay focused and push forward despite obstacles. In career, it signals advancement and overcoming competition. In relationships, it speaks of the need to balance independence with partnership. As a challenge, it warns against aggression, control issues, or moving forward without clear direction. The message: harness your inner contradictions, maintain focus, and charge ahead — victory belongs to those who refuse to give up.',
        meaningRu: 'Колесница олицетворяет победу через решимость и силу воли. Возница управляет двумя противоборствующими силами (часто изображёнными как чёрный и белый сфинксы) — символизируя овладение противоречивыми эмоциями или обстоятельствами. Эта карта появляется, когда нужно сохранять фокус и двигаться вперёд вопреки препятствиям. В карьере сигнализирует о продвижении и преодолении конкуренции. В отношениях говорит о необходимости баланса между независимостью и партнёрством. Как препятствие — предупреждает об агрессии, проблемах с контролем или движении вперёд без ясного направления. Послание: обуздайте внутренние противоречия, сохраняйте фокус и двигайтесь вперёд — победа принадлежит тем, кто не сдаётся.',
    },
    {
        id: 8, key: 'strength', name: 'Strength', nameRu: 'Сила', image: '/tarot/strength.png',
        keywords: ['courage', 'patience', 'inner strength', 'compassion'],
        keywordsRu: ['мужество', 'терпение', 'внутренняя сила', 'сострадание'],
        meaning: 'Strength is not about brute force — it is about gentle power, patience, and mastering one\'s own inner beasts. The woman taming the lion symbolizes courage through compassion rather than domination. This card appears when a situation requires endurance, emotional resilience, and a soft approach to hard problems. In relationships, it speaks of unconditional love and the patience to work through difficulties. In career, it signals quiet confidence and influence through character rather than authority. As a challenge, it warns of self-doubt, suppressed anger, or burnout from always being the strong one. The message: your greatest power lies not in force, but in the courage to remain gentle when the world is harsh.',
        meaningRu: 'Сила — это не про грубую мощь. Эта карта о мягкой силе, терпении и обуздании собственных внутренних демонов. Женщина, укрощающая льва, символизирует мужество через сострадание, а не через подавление. Карта появляется, когда ситуация требует выносливости, эмоциональной стойкости и мягкого подхода к трудным проблемам. В отношениях говорит о безусловной любви и терпении в преодолении трудностей. В карьере — о тихой уверенности и влиянии через характер, а не через должность. Как препятствие — предупреждает о неуверенности в себе, подавленном гневе или выгорании от постоянной роли «сильного». Послание: ваша величайшая сила — не в давлении, а в мужестве оставаться мягким, когда мир жесток.',
    },
    {
        id: 9, key: 'hermit', name: 'The Hermit', nameRu: 'Отшельник', image: '/tarot/hermit.png',
        keywords: ['soul-searching', 'introspection', 'solitude', 'guidance'],
        keywordsRu: ['поиск себя', 'самоанализ', 'уединение', 'наставление'],
        meaning: 'The Hermit represents withdrawal from the noise of the world to seek inner truth. Carrying a lantern in darkness, he symbolizes the search for authentic wisdom that can only be found in solitude and self-reflection. This card appears when you need to step back, slow down, and look within for answers. In relationships, it may signal a need for space or a period of healing alone. In career, it suggests mentorship (giving or receiving) or a pivot toward more meaningful work. As a challenge, it warns against isolation, loneliness, or refusing to engage with life. The message: the answers you seek are not in the crowd — light your own lantern and walk your own path.',
        meaningRu: 'Отшельник олицетворяет уход от мирского шума в поисках внутренней истины. С фонарём во тьме он символизирует поиск подлинной мудрости, которую можно обрести только в уединении и самоанализе. Эта карта появляется, когда нужно сделать шаг назад, замедлиться и искать ответы внутри себя. В отношениях может указывать на потребность в пространстве или период исцеления в одиночестве. В карьере — на наставничество или поворот к более осмысленной деятельности. Как препятствие — предупреждает об изоляции, одиночестве или отказе участвовать в жизни. Послание: ответы, которые вы ищете, не в толпе — зажгите свой фонарь и идите своим путём.',
    },
    {
        id: 10, key: 'wheel_of_fortune', name: 'Wheel of Fortune', nameRu: 'Колесо Фортуны', image: '/tarot/wheel_of_fortune.png',
        keywords: ['fate', 'cycles', 'turning point', 'destiny'],
        keywordsRu: ['судьба', 'циклы', 'поворотный момент', 'предназначение'],
        meaning: 'The Wheel of Fortune represents the cyclical nature of life — what goes up must come down, and what is down will rise again. It speaks of fate, karma, and the turning points that redirect our path. This card signals that change is coming, often unexpectedly, and it is beyond your full control. In career, it can mean a lucky break or sudden shift. In relationships, it speaks of destined meetings or phases ending naturally. As a challenge, it warns against resisting inevitable change or believing bad luck is permanent. The message: life moves in cycles — embrace the turn of the wheel, adapt to change, and trust that this too shall pass.',
        meaningRu: 'Колесо Фортуны олицетворяет цикличность жизни — то, что поднимается, неизбежно опускается, а то, что внизу, снова поднимется. Оно говорит о судьбе, карме и поворотных моментах, которые перенаправляют наш путь. Эта карта сигнализирует, что перемены приближаются — часто неожиданно — и они не полностью в вашей власти. В карьере может означать удачный шанс или внезапный поворот. В отношениях — о предначертанных встречах или естественном завершении этапов. Как препятствие — предупреждает о сопротивлении неизбежным переменам или вере в то, что чёрная полоса вечна. Послание: жизнь движется циклами — примите поворот колеса, адаптируйтесь и верьте, что и это пройдёт.',
    },
    {
        id: 11, key: 'justice', name: 'Justice', nameRu: 'Справедливость', image: '/tarot/justice.png',
        keywords: ['fairness', 'truth', 'law', 'cause and effect'],
        keywordsRu: ['справедливость', 'истина', 'закон', 'причина и следствие'],
        meaning: 'Justice represents truth, fairness, and the law of cause and effect. She holds the sword of discernment and the scales of balance — every action has consequences, and this card calls for radical honesty and accountability. In legal or financial matters, it signals fair outcomes. In relationships, it speaks of the need for equality, honest communication, and addressing imbalances. In career, it points to ethical decisions and being evaluated fairly. As a challenge, it warns against dishonesty, avoiding responsibility, or being judged harshly. The message: examine the situation with clear eyes, take responsibility for your part, and trust that truth will prevail.',
        meaningRu: 'Справедливость олицетворяет истину, честность и закон причины и следствия. Она держит меч различения и весы равновесия — каждое действие имеет последствия, и эта карта призывает к радикальной честности и ответственности. В юридических или финансовых вопросах сигнализирует о справедливом исходе. В отношениях говорит о необходимости равенства, честного общения и устранения дисбаланса. В карьере указывает на этичные решения и объективную оценку. Как препятствие — предупреждает о нечестности, избегании ответственности или суровом суждении. Послание: посмотрите на ситуацию ясными глазами, возьмите ответственность за свою часть и верьте — истина восторжествует.',
    },
    {
        id: 12, key: 'hanged_man', name: 'The Hanged Man', nameRu: 'Повешенный', image: '/tarot/hanged_man.png',
        keywords: ['surrender', 'new perspective', 'letting go', 'pause'],
        keywordsRu: ['принятие', 'новый взгляд', 'отпускание', 'пауза'],
        meaning: 'The Hanged Man represents voluntary surrender and seeing the world from a radically different perspective. Suspended upside down, he has chosen to pause — not out of weakness, but to gain wisdom that action cannot provide. This card appears when you are stuck and pushing harder will not help. In relationships, it asks you to see things from the other person\'s point of view. In career, it signals that waiting and reflecting will serve you better than forcing results. As a challenge, it warns against stagnation, martyrdom, or refusing to let go of outdated beliefs. The message: sometimes the most powerful thing you can do is stop, surrender control, and let a new perspective emerge.',
        meaningRu: 'Повешенный олицетворяет добровольную сдачу и взгляд на мир с радикально другой точки зрения. Подвешенный вверх ногами, он выбрал паузу — не из слабости, а чтобы обрести мудрость, которую действие дать не может. Эта карта появляется, когда вы застряли и продолжать давить бесполезно. В отношениях призывает взглянуть на вещи глазами другого человека. В карьере — что ожидание и размышление послужат лучше, чем форсирование результатов. Как препятствие — предупреждает о стагнации, мученичестве или отказе отпустить устаревшие убеждения. Послание: иногда самое сильное, что вы можете сделать — это остановиться, отпустить контроль и позволить новому взгляду проявиться.',
    },
    {
        id: 13, key: 'death', name: 'Death', nameRu: 'Смерть', image: '/tarot/death.png',
        keywords: ['transformation', 'endings', 'transition', 'change'],
        keywordsRu: ['трансформация', 'завершение', 'переход', 'перемены'],
        meaning: 'Death rarely means physical death — it is the card of profound transformation. Something must end for something new to begin. Like autumn clearing the way for spring, this card signals the necessary death of old patterns, relationships, identities, or situations that no longer serve you. In relationships, it can mean the end of a phase or a complete transformation of the dynamic. In career, it signals closing one chapter and opening another. As a challenge, it warns against clinging to what is dying or fearing necessary change. The message: let go of what is ending with grace — the transformation is not destruction, it is rebirth.',
        meaningRu: 'Смерть редко означает физическую гибель — это карта глубокой трансформации. Что-то должно закончиться, чтобы началось новое. Как осень расчищает путь весне, эта карта сигнализирует о необходимом завершении старых паттернов, отношений, идентичностей или ситуаций, которые больше не служат вам. В отношениях может означать конец этапа или полную трансформацию динамики. В карьере — закрытие одной главы и начало другой. Как препятствие — предупреждает о цеплянии за отмирающее или страхе перед необходимыми переменами. Послание: отпустите уходящее с достоинством — эта трансформация не разрушение, а перерождение.',
    },
    {
        id: 14, key: 'temperance', name: 'Temperance', nameRu: 'Умеренность', image: '/tarot/temperance.png',
        keywords: ['balance', 'moderation', 'patience', 'harmony'],
        keywordsRu: ['баланс', 'умеренность', 'терпение', 'гармония'],
        meaning: 'Temperance represents the art of balance, patience, and alchemical blending of opposites. The angel pours water between two cups — mixing fire and water, conscious and unconscious, action and reflection into a harmonious whole. This card appears when moderation and a middle path are needed. In relationships, it speaks of compromise, healing, and finding harmony after conflict. In career, it signals the need for patience and steady progress rather than extremes. As a challenge, it warns against excess, impatience, or losing your center. The message: find your equilibrium — the right answer lies not in either extreme, but in the patient blending of both.',
        meaningRu: 'Умеренность олицетворяет искусство баланса, терпения и алхимического сплавления противоположностей. Ангел переливает воду между двумя чашами — смешивая огонь и воду, сознательное и бессознательное, действие и рефлексию в гармоничное целое. Эта карта появляется, когда нужна умеренность и срединный путь. В отношениях говорит о компромиссе, исцелении и обретении гармонии после конфликта. В карьере — о необходимости терпения и устойчивого продвижения вместо крайностей. Как препятствие — предупреждает об избыточности, нетерпении или потере своего центра. Послание: найдите равновесие — верный ответ не в крайностях, а в терпеливом сплавлении обеих сторон.',
    },
    {
        id: 15, key: 'devil', name: 'The Devil', nameRu: 'Дьявол', image: '/tarot/devil.png',
        keywords: ['bondage', 'materialism', 'shadow self', 'attachment'],
        keywordsRu: ['зависимость', 'материализм', 'теневая сторона', 'привязанность'],
        meaning: 'The Devil represents bondage, addiction, and the shadow side of human nature — but the chains around the figures\' necks are loose enough to remove. This card reveals where you are trapped by your own fears, desires, or unhealthy attachments. It can point to toxic relationships, addictions, materialism, or self-destructive patterns. In relationships, it signals codependency, obsession, or staying in a harmful dynamic out of fear. In career, it warns of golden handcuffs or compromising values for money. As a challenge, it confronts you with uncomfortable truths about your own complicity in your suffering. The message: you are not as trapped as you believe — recognize the chains, and you have the power to free yourself.',
        meaningRu: 'Дьявол олицетворяет зависимость, привязанность и теневую сторону человеческой природы — но цепи на шеях фигур достаточно свободны, чтобы их снять. Эта карта показывает, где вы в ловушке собственных страхов, желаний или нездоровых привязанностей. Может указывать на токсичные отношения, зависимости, материализм или саморазрушительные паттерны. В отношениях сигнализирует о созависимости, одержимости или пребывании в разрушительной динамике из страха. В карьере — о золотых наручниках или компромиссе с ценностями ради денег. Как препятствие — сталкивает вас с неудобной правдой о вашем собственном соучастии в своих страданиях. Послание: вы не так пойманы, как думаете — осознайте цепи, и вы обретёте силу освободиться.',
    },
    {
        id: 16, key: 'tower', name: 'The Tower', nameRu: 'Башня', image: '/tarot/tower.png',
        keywords: ['upheaval', 'sudden change', 'revelation', 'awakening'],
        keywordsRu: ['потрясение', 'внезапная перемена', 'откровение', 'пробуждение'],
        meaning: 'The Tower represents sudden, dramatic upheaval — structures built on false foundations are struck down by lightning. This card is among the most feared, but its destruction is ultimately liberating. It shatters illusions, lies, and ego-built towers to reveal raw truth beneath. In relationships, it can signal sudden breakups, revelations, or crises that force honesty. In career, it means unexpected disruption — layoffs, project collapse, or paradigm shifts. As a challenge, it warns that avoidance only makes the eventual collapse worse. The message: what is being destroyed was never built to last — let the tower fall, and you will find firmer ground beneath the rubble.',
        meaningRu: 'Башня олицетворяет внезапный, драматический переворот — структуры, возведённые на ложном фундаменте, поражаются молнией. Эта карта — одна из самых пугающих, но её разрушение в итоге освобождает. Она разбивает иллюзии, ложь и башни эго, обнажая истину. В отношениях может означать внезапный разрыв, откровение или кризис, вынуждающий к честности. В карьере — неожиданное потрясение: увольнение, крах проекта, смену парадигмы. Как препятствие — предупреждает, что избегание только усугубляет неизбежный обвал. Послание: то, что разрушается, никогда не было построено на века — позвольте башне пасть, и вы найдёте твёрдую почву под обломками.',
    },
    {
        id: 17, key: 'star', name: 'The Star', nameRu: 'Звезда', image: '/tarot/star.png',
        keywords: ['hope', 'inspiration', 'serenity', 'renewal'],
        keywordsRu: ['надежда', 'вдохновение', 'безмятежность', 'обновление'],
        meaning: 'The Star appears after The Tower — it is the calm after the storm, the first light of hope after darkness. This card represents healing, inspiration, and reconnecting with your higher purpose. The woman pours water onto the land and into the pool — nourishing both the conscious and unconscious, the practical and the spiritual. In relationships, it signals healing and renewed faith in love. In career, it points to inspiration, creative flow, and feeling aligned with your purpose. As a challenge, it warns against losing hope or disconnecting from your dreams. The message: the worst is behind you — open yourself to hope, trust in the universe, and let your inner light guide you forward.',
        meaningRu: 'Звезда появляется после Башни — это затишье после бури, первый луч надежды после тьмы. Эта карта олицетворяет исцеление, вдохновение и воссоединение с высшим предназначением. Женщина льёт воду на землю и в озеро — питая и сознательное, и бессознательное, практическое и духовное. В отношениях сигнализирует об исцелении и обновлённой вере в любовь. В карьере указывает на вдохновение, творческий поток и ощущение совпадения с предназначением. Как препятствие — предупреждает об утрате надежды или отрыве от мечтаний. Послание: худшее позади — откройтесь надежде, доверьтесь вселенной и позвольте внутреннему свету вести вас вперёд.',
    },
    {
        id: 18, key: 'moon', name: 'The Moon', nameRu: 'Луна', image: '/tarot/moon.png',
        keywords: ['illusion', 'fear', 'subconscious', 'intuition'],
        keywordsRu: ['иллюзия', 'страх', 'подсознание', 'интуиция'],
        meaning: 'The Moon represents the realm of illusion, fear, and the subconscious. Under moonlight, things are not as they appear — shadows play tricks, anxieties magnify, and the path ahead is unclear. This card appears when confusion, deception, or deep-seated fears cloud your judgment. In relationships, it signals hidden motives, unspoken fears, or projecting past wounds onto the present. In career, it warns of unclear situations or deceptive appearances. As a challenge, it warns against letting fear paralyze you or making decisions based on anxiety rather than reality. The message: acknowledge your fears but do not let them rule you — the path through the darkness requires trusting your intuition even when you cannot see clearly.',
        meaningRu: 'Луна олицетворяет царство иллюзий, страхов и подсознания. В лунном свете всё не таково, каким кажется — тени играют злые шутки, тревоги усиливаются, путь впереди неясен. Эта карта появляется, когда смятение, обман или глубинные страхи затуманивают суждение. В отношениях указывает на скрытые мотивы, невысказанные страхи или проекцию старых ран на настоящее. В карьере — предупреждает о неясных ситуациях или обманчивой видимости. Как препятствие — предостерегает от парализующего страха или решений, основанных на тревоге, а не реальности. Послание: признайте свои страхи, но не позволяйте им управлять вами — путь сквозь тьму требует доверия интуиции, даже когда вы не видите ясно.',
    },
    {
        id: 19, key: 'sun', name: 'The Sun', nameRu: 'Солнце', image: '/tarot/sun.png',
        keywords: ['joy', 'success', 'vitality', 'positivity'],
        keywordsRu: ['радость', 'успех', 'жизненная сила', 'позитив'],
        meaning: 'The Sun is the most positive card in the deck — it represents pure joy, success, vitality, and clarity. After the confusion of The Moon, The Sun burns away all illusion and reveals the truth in brilliant light. This card signals a period of happiness, achievement, and confidence. In relationships, it speaks of warm, honest love and the joy of being truly seen. In career, it signals success, recognition, and creative fulfillment. Even as a challenge, The Sun rarely loses its positive meaning — it may simply ask you to step out of the shadows and allow yourself to shine. The message: embrace the light — happiness is not just possible, it is here.',
        meaningRu: 'Солнце — самая позитивная карта в колоде. Она олицетворяет чистую радость, успех, жизненную силу и ясность. После смятения Луны Солнце сжигает все иллюзии и являет истину в ослепительном свете. Эта карта сигнализирует о периоде счастья, достижений и уверенности. В отношениях говорит о тёплой, честной любви и радости быть по-настоящему увиденным. В карьере — об успехе, признании и творческой реализации. Даже как препятствие Солнце редко теряет позитивное значение — оно лишь просит выйти из тени и позволить себе сиять. Послание: примите свет — счастье не просто возможно, оно уже здесь.',
    },
    {
        id: 20, key: 'judgement', name: 'Judgement', nameRu: 'Суд', image: '/tarot/judgement.png',
        keywords: ['rebirth', 'inner calling', 'absolution', 'reflection'],
        keywordsRu: ['возрождение', 'внутренний зов', 'прощение', 'переосмысление'],
        meaning: 'Judgement represents a moment of reckoning, rebirth, and answering your true calling. The angel\'s trumpet wakes the dead from their graves — it is time to rise, shed the old self, and step into a higher version of who you are. This card asks for honest self-evaluation without shame — acknowledging the past, forgiving yourself and others, and making a conscious choice to transform. In relationships, it signals second chances, reconciliation, or a pivotal decision. In career, it points to a calling that goes beyond just earning a living. As a challenge, it warns against avoiding self-reflection or refusing to heed the call. The message: you are being called to rise — answer honestly, forgive freely, and step into your next chapter.',
        meaningRu: 'Суд олицетворяет момент расплаты, перерождения и ответа на своё истинное призвание. Труба ангела пробуждает мёртвых из могил — пришло время подняться, сбросить старое «я» и шагнуть в высшую версию себя. Эта карта просит честной самооценки без стыда — признания прошлого, прощения себя и других и осознанного выбора трансформироваться. В отношениях сигнализирует о вторых шансах, примирении или решающем решении. В карьере указывает на призвание, выходящее за рамки простого заработка. Как препятствие — предупреждает об избегании самоанализа или отказе услышать зов. Послание: вас зовут подняться — ответьте честно, простите свободно и шагните в свою следующую главу.',
    },
    {
        id: 21, key: 'world', name: 'The World', nameRu: 'Мир', image: '/tarot/world.png',
        keywords: ['completion', 'achievement', 'fulfillment', 'wholeness'],
        keywordsRu: ['завершение', 'достижение', 'исполнение', 'целостность'],
        meaning: 'The World is the final card of the Major Arcana — it represents completion, wholeness, and the successful end of a major life cycle. The dancing figure within the laurel wreath has integrated all the lessons of the journey. This card signals achievement, fulfillment, and a sense of belonging in the world. In relationships, it speaks of deep fulfillment and a relationship that has weathered storms and emerged whole. In career, it means reaching a significant milestone or completing a major project. As a challenge, it may signal the fear of endings or reluctance to close a chapter. The message: celebrate what you have accomplished — and know that every ending is the seed of a new beginning.',
        meaningRu: 'Мир — последняя карта Старших Арканов. Она олицетворяет завершение, целостность и успешное окончание большого жизненного цикла. Танцующая фигура в лавровом венке интегрировала все уроки пути. Эта карта сигнализирует о достижении, исполнении и чувстве своего места в мире. В отношениях говорит о глубокой наполненности и союзе, прошедшем через бури и ставшем целостным. В карьере — о достижении значительного рубежа или завершении крупного проекта. Как препятствие — может указывать на страх завершений или нежелание закрыть главу. Послание: отпразднуйте свои достижения — и знайте, что каждое завершение есть семя нового начала.',
    },
]

/**
 * Draw N random cards from the Major Arcana without replacement.
 */
export function drawTarotCards(count: number = 3): TarotCard[] {
    const deck = [...MAJOR_ARCANA]
    const drawn: TarotCard[] = []

    for (let i = 0; i < count && deck.length > 0; i++) {
        const idx = Math.floor(Math.random() * deck.length)
        drawn.push(deck.splice(idx, 1)[0])
    }

    return drawn
}
