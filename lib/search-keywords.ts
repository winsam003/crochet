// Curated aliases, not machine translation. Keep canonical names and context rules reviewable.
type Keyword = { aliases: string[]; value: string; category?: string; group?: string };
const keywords: Keyword[] = [];
function add(rows: string, group?: string) {
  for (const row of rows.trim().split("\n")) {
    const [value, aliases, category] = row.trim().split("|");
    keywords.push({ value, aliases: aliases.split(","), category, group });
  }
}
add(
  `
pikachu|피카츄,피카추
eevee|이브이
snorlax|잠만보
charmander|파이리
squirtle|꼬부기
bulbasaur|이상해씨
jigglypuff|푸린
gengar|팬텀
ditto|메타몽
psyduck|고라파덕
mew|뮤
piplup|팽도리
rowlet|나몰빼미
mimikyu|따라큐
togepi|토게피
chikorita|치코리타
pokemon|포켓몬,포켓몬스터
`,
  "pokemon",
);
add(
  `
hello kitty|헬로키티
my melody|마이멜로디
kuromi|쿠로미
cinnamoroll|시나모롤,시나몬롤
pompompurin|폼폼푸린
pochacco|포차코
keroppi|케로피
tuxedo sam|턱시도샘
sanrio|산리오
`,
  "sanrio",
);
add(
  `
totoro|토토로
no face|가오나시
jiji|지지
calcifer|캘시퍼,칼시퍼
kodama|코다마
soot sprite|숯검댕이,검댕이,먼지요정
ghibli|지브리
`,
  "ghibli",
);
add(
  `
mickey mouse|미키마우스
minnie mouse|미니마우스
winnie the pooh|곰돌이푸,위니더푸
piglet|피글렛
tigger|티거
eeyore|이요르
olaf|올라프
baymax|베이맥스
donald duck|도날드덕,도널드덕
daisy duck|데이지덕
chip and dale|칩앤데일,칩과데일
dumbo|덤보
nemo|니모
sulley|설리
mike wazowski|마이크와조스키
lotso|로츠,랏소
lilo stitch|릴로와스티치,디즈니스티치
disney|디즈니
`,
  "disney",
);
add(
  `
spongebob|스폰지밥
patrick star|뚱이
squidward|징징이
mr krabs|집게사장
sandy cheeks|다람이
gary the snail|핑핑이
plankton|플랑크톤
mrs puff|퐁퐁부인
`,
  "spongebob",
);
add(
  `
kirby|커비
mario|마리오
luigi|루이지
yoshi|요시
sonic|소닉
princess peach|피치공주
bowser|쿠파
toad|키노피오
animal crossing|동물의숲
`,
  "game",
);
add(`
snoopy|스누피
charlie brown|찰리브라운
woodstock|우드스탁
moomin|무민
miffy|미피
rilakkuma|리락쿠마
korilakkuma|코리락쿠마
doraemon|도라에몽
minion|미니언,미니언즈
wallace|월레스
gromit|그로밋
shaun the sheep|숀더쉽
elmo|엘모
cookie monster|쿠키몬스터
big bird|빅버드
kermit|커밋
bmo|비모
creeper|크리퍼
enderman|엔더맨
toothless|투슬리스
chiikawa|치이카와
hachiware|하치와레
pingu|핑구
garfield|가필드
paddington|패딩턴
barbapapa|바바파파
`);
add(`
bucket hat|버킷햇,벙거지|hat
beanie|비니|hat
cardigan|가디건,카디건|clothing
sweater|스웨터,니트|clothing
vest|조끼,베스트|clothing
pullover|풀오버|clothing
bolero|볼레로|clothing
crop top|크롭톱,크롭탑|clothing
tank top|탱크톱,탱크탑|clothing
dress|원피스|clothing
skirt|치마,스커트|clothing
pants|바지|clothing
poncho|판초,폰초|clothing
hood|후드
pouch|파우치|bag
drawstring bag|복조리가방|bag
market bag|네트백,그물가방|bag
tote bag|토트백|bag
crossbody bag|크로스백|bag
phone bag|휴대폰가방,핸드폰가방,폰백|bag
bottle holder|물병가방,물병주머니|bag
|가방|bag
|모자|hat
|의류|clothing
|인형,아미구루미|softies
scarf|목도리,스카프|neck-torso
shawl|숄|neck-torso
blanket|담요,블랭킷|home
scrubbie|수세미|home
coaster|티코스터,코스터|home
|양말|socks
|장갑|hands
fingerless gloves|핑거리스장갑,손가락없는장갑,핸드워머|hands
keychain|키링,키홀더
bookmark|책갈피,북마크
scrunchie|머리끈,스크런치,곱창밴드
headband|헤어밴드,머리띠
glasses case|안경집
card holder|카드지갑
pillow|쿠션|home
basket|바구니|home
rug|러그,발매트|home
airpods case|에어팟케이스
earbud case|이어폰케이스
cup cozy|컵홀더,컵커버
tissue cover|티슈커버,휴지커버|home
potholder|냄비받침|home
book cover|북커버
pincushion|핀쿠션,바늘방석
rabbit|토끼
cat ears|고양이귀
cat|고양이
puppy|강아지
teddy bear|곰돌이
bear|곰
frog|개구리
duck|오리
chick|병아리
penguin|펭귄
panda|판다
fox|여우
otter|수달
sea otter|해달
hedgehog|고슴도치
capybara|카피바라
whale|고래
octopus|문어
turtle|거북이
dinosaur|공룡
dragon|용
unicorn|유니콘
beaver|비버
raccoon|라쿤,너구리
alpaca|알파카
llama|라마
sloth|나무늘보
bat|박쥐
jellyfish|해파리
stingray|가오리
shark|상어
shrimp|새우
bee|꿀벌
strawberry|딸기
cherry|체리
lemon|레몬
watermelon|수박
carrot|당근
mushroom|버섯
acorn|도토리
pumpkin|호박
cupcake|컵케이크
donut|도넛,도너츠
heart|하트
star|별
moon|달
cloud|구름
bow|리본
butterfly|나비
flower|꽃
tulip|튤립
daisy|데이지꽃
rose|장미
sunflower|해바라기
lavender|라벤더
four leaf clover|네잎클로버
cactus|선인장
succulent|다육식물,다육이
granny square|그래니스퀘어,그레니스퀘어
motif|모티브
cable|꽈배기,케이블무늬
colorwork|배색
lace|레이스
ruffle|프릴,러플
patchwork|패치워크
Tunisian crochet|튀니지코바늘,튀니지뜨개
popcorn stitch|팝콘스티치,팝콘뜨기
christmas|크리스마스
santa|산타
snowman|눈사람
reindeer|순록
halloween|할로윈
ghost|유령
easter|부활절
mini|미니
`);
add(
  `
cute|귀여운,깜찍한,앙증맞은
pretty|예쁜,이쁜
lovely|사랑스러운
cool|멋진
elegant|우아한
simple|심플한,단순한
basic|기본적인,베이직한
vintage|빈티지한
classic|클래식한
mini|작은,조그만,조그마한
large|큰,커다란
giant|초대형,아주큰
long|긴,기다란
short|짧은
chunky|두꺼운,두툼한
thin|얇은
round|둥근,동그란
flat|납작한
fluffy|폭신한,복슬복슬한,보송보송한
soft|부드러운
warm|따뜻한,따듯한
cozy|포근한
colorful|알록달록한
fancy|화려한
`,
  "adjective",
);
// Ambiguous aliases require a franchise or explicit character context.
const ambiguous: Record<
  string,
  { fallback: string; choices: [string, string][]; context: RegExp }
> = {
  스티치: {
    fallback: "스티치",
    choices: [
      ["디즈니 캐릭터 스티치", "lilo stitch"],
      ["뜨개 기법 stitch", "stitch"],
    ],
    context: /디즈니|릴로|캐릭터|disney|lilo/i,
  },
  진주: {
    fallback: "pearl",
    choices: [
      ["진주 장식", "pearl"],
      ["스폰지밥의 진주", "pearl krabs"],
    ],
    context: /스폰지밥|spongebob/i,
  },
  래리: {
    fallback: "래리",
    choices: [["스폰지밥의 래리", "larry the lobster"]],
    context: /스폰지밥|spongebob/i,
  },
  피치: {
    fallback: "peach",
    choices: [
      ["복숭아", "peach"],
      ["피치 공주", "princess peach"],
    ],
    context: /마리오|공주|mario|princess/i,
  },
  데이지: {
    fallback: "daisy",
    choices: [
      ["데이지꽃", "daisy"],
      ["디즈니 데이지덕", "daisy duck"],
    ],
    context: /디즈니|도날드|도널드|disney|donald/i,
  },
  핀: {
    fallback: "핀",
    choices: [["어드벤처 타임의 핀", "finn adventure time"]],
    context: /어드벤처타임|adventure\s*time/i,
  },
  제이크: {
    fallback: "제이크",
    choices: [["어드벤처 타임의 제이크", "jake adventure time"]],
    context: /어드벤처타임|adventure\s*time/i,
  },
  스티브: {
    fallback: "스티브",
    choices: [["마인크래프트의 스티브", "steve minecraft"]],
    context: /마인크래프트|minecraft/i,
  },
  우사기: {
    fallback: "우사기",
    choices: [["치이카와의 우사기", "usagi chiikawa"]],
    context: /치이카와|chiikawa/i,
  },
  루: {
    fallback: "루",
    choices: [["곰돌이 푸의 루", "roo"]],
    context: /곰돌이푸|위니더푸|winnie|pooh/i,
  },
};
add(`
adventure time|어드벤처타임
minecraft|마인크래프트
peach|복숭아
stitch|뜨개기법스티치
pearl krabs|스폰지밥진주
larry the lobster|스폰지밥래리
princess peach|마리오피치
daisy duck|디즈니데이지
finn adventure time|어드벤처타임핀
jake adventure time|어드벤처타임제이크
steve minecraft|마인크래프트스티브
usagi chiikawa|치이카와우사기
roo|곰돌이푸루
boo|마리오부끄부끄
mr bean teddy|미스터빈테디
how to train your dragon|드래곤길들이기
wallace and gromit|월레스와그로밋
sesame street|세서미스트리트
muppets|머펫
peanuts|피너츠
zootopia|주토피아
judy hopps|주디홉스
nick wilde|닉와일드
winnie the pooh|푸우
woody toy story|토이스토리우디
buzz lightyear|버즈라이트이어
alien toy story|토이스토리알린
stitch|뜨개스티치
popcorn|팝콘
baby|아기,베이비
baby booties|아기신발,아기덧신|socks
balaclava|바라클라바|hat
beret|베레모|hat
bonnet|보닛|hat
mittens|벙어리장갑|hands
cowl|넥워머|neck-torso
slippers|슬리퍼,실내화
pencil case|필통
wallet|지갑
bag charm|가방참
bunny|바니
seal|물범,바다표범
lion|사자
tiger|호랑이
elephant|코끼리
giraffe|기린
sheep|양
chicken|닭
horse|말
pig|돼지
monkey|원숭이
koala|코알라
owl|부엉이,올빼미
parrot|앵무새
flamingo|플라밍고
snail|달팽이
crab|게
lobster|바닷가재
apple|사과
orange|오렌지
banana|바나나
avocado|아보카도
ice cream|아이스크림
bread|빵
croissant|크루아상,크로와상
egg|계란,달걀
snowflake|눈꽃
rainbow|무지개
sun|태양
leaf|나뭇잎
cherry blossom|벚꽃
hydrangea|수국
lily of the valley|은방울꽃
rose|장미꽃
bouquet|꽃다발
checkered|체크무늬
striped|줄무늬,스트라이프
bobble|보블뜨기
moss stitch|모스스티치
shell stitch|조개무늬
no sew|노소우,무봉제
`);
export const keywordCount = keywords.length;
export type SearchChoice = { label: string; query: string };
type Piece = {
  value: string;
  category?: string;
  intent?: string;
  source: string;
  group?: string;
  choices?: [string, string][];
};
const intentAliases: Record<string, string> = {
  코바늘: "crochet",
  대바늘: "knitting",
  무료: "free",
  초보: "easy",
  초보자: "easy",
  초보용: "easy",
  초보자용: "easy",
  쉬운: "easy",
  도안: "ignore",
  뜨는법: "ignore",
  만들기: "ignore",
  추천: "ignore",
  캐릭터: "ignore",
};
const entries = keywords
  .flatMap((k) => k.aliases.map((alias) => ({ ...k, alias })))
  .concat(
    Object.keys(ambiguous).map((alias) => ({
      alias,
      aliases: [alias],
      value: alias,
      category: undefined,
      group: undefined,
    })),
  )
  .concat(
    Object.keys(intentAliases).map((alias) => ({
      alias,
      aliases: [alias],
      value: "",
      category: undefined,
      group: undefined,
    })),
  )
  .sort((a, b) => b.alias.length - a.alias.length);

export function expandKeywords(input: string) {
  const context = input.replace(/\s+/g, "");
  function parse(word: string): Piece[] | null {
    const memo = new Map<number, Piece[] | null>();
    function visit(offset: number): Piece[] | null {
      if (offset === word.length) return [];
      if (memo.has(offset)) return memo.get(offset)!;
      for (const entry of entries) {
        if (!word.startsWith(entry.alias, offset)) continue;
        const rest = visit(offset + entry.alias.length);
        if (!rest) continue;
        const rule = ambiguous[entry.alias];
        const matched = rule?.context.test(context);
        const value = rule
          ? matched
            ? rule.choices[entry.alias === "스티치" ? 0 : rule.choices.length - 1][1]
            : rule.fallback
          : entry.value;
        const pieces = [
          {
            value,
            category: entry.category,
            group:
              matched && ["진주", "래리"].includes(entry.alias)
                ? "spongebob"
                : matched && ["데이지", "스티치", "루"].includes(entry.alias)
                  ? "disney"
                  : entry.group,
            source: entry.alias,
            intent: intentAliases[entry.alias],
            choices: rule && !matched ? rule.choices : undefined,
          },
          ...rest,
        ];
        memo.set(offset, pieces);
        return pieces;
      }
      memo.set(offset, null);
      return null;
    }
    return visit(0);
  }
  function parseToken(word: string): Piece[] | null {
    const direct = parse(word);
    if (direct) return direct;
    // Strip a grammatical suffix only after recognizing a complete known name.
    const match = word.match(/^(.*?)(으로|이랑|처럼|을|를|의|은|는|이|가|랑|로)$/);
    if (!match) return null;
    const stem = parse(match[1]);
    return stem?.some((piece) => piece.value || piece.category) ? stem : null;
  }
  const pieces: Piece[] = [];
  for (const chunk of input.match(/[가-힣\s]+|[^가-힣\s]+/g) || []) {
    if (!chunk.trim()) continue;
    if (!/[가-힣]/.test(chunk)) {
      pieces.push({ value: chunk, source: chunk });
      continue;
    }
    const parsed = parse(chunk.replace(/\s+/g, ""));
    if (parsed) pieces.push(...parsed);
    else
      for (const word of chunk.trim().split(/\s+/))
        pieces.push(...(parseToken(word) || [{ value: word, source: word }]));
  }
  // A franchise is context, not an extra required keyword, when its character is present.
  const franchiseValues = new Set(["pokemon", "sanrio", "ghibli", "disney", "spongebob"]);
  const meaningful = pieces.filter(
    (p) =>
      !franchiseValues.has(p.value) ||
      !pieces.some(
        (other) => other !== p && other.group === p.group && !franchiseValues.has(other.value),
      ),
  );
  function queryFor(replace?: Piece, value?: string, omitAdjectives = false) {
    const words = meaningful
      .filter((p) => !omitAdjectives || p.group !== "adjective")
      .flatMap((p) => (p === replace ? value! : p.value).split(/\s+/))
      .filter(Boolean);
    return words
      .filter(
        (word, index) =>
          words.findIndex((other) => other.toLowerCase() === word.toLowerCase()) === index,
      )
      .join(" ");
  }
  const broaderQuery = queryFor(undefined, undefined, true);
  const broaderLabel = meaningful
    .filter((p) => p.group !== "adjective" && (p.value || p.category))
    .map((p) => p.source)
    .join(" ");
  return {
    query: queryFor(),
    broaderSearch:
      meaningful.some((p) => p.group === "adjective") && broaderLabel && broaderQuery !== queryFor()
        ? { query: broaderQuery, label: broaderLabel }
        : null,
    categories: [...new Set(pieces.map((p) => p.category).filter((v): v is string => !!v))],
    intents: new Set(pieces.map((p) => p.intent)),
    choices: meaningful.flatMap((p) =>
      (p.choices || []).map(([label, value]) => ({ label, query: queryFor(p, value) })),
    ),
  };
}
