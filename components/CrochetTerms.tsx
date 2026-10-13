import type { Pattern } from "@/lib/patterns";

const terms = [
  ["사슬뜨기", "ch", "ch"],
  ["빼뜨기", "sl st", "ss / sl st"],
  ["짧은뜨기", "sc", "dc"],
  ["긴뜨기", "hdc", "htr"],
  ["한길긴뜨기", "dc", "tr"],
  ["두길긴뜨기", "tr", "dtr"],
  ["코 늘리기", "inc", "inc"],
  ["코 줄이기", "dec", "dec"],
  ["반복", "rep", "rep"],
];

export default function CrochetTerms({ pattern: p }: { pattern: Pattern }) {
  const us = !!p.has_us_terminology;
  const uk = !!p.has_uk_terminology;
  const both = us === uk;
  return (
    <div className="terminology-note">
      <h3>영어 약어, 여기서 바로 읽어요</h3>
      <p>
        {both
          ? us
            ? "미국식·영국식이 모두 등록되어 있어요. 받은 파일의 US / UK 표기에 맞는 열을 읽으세요."
            : "약어 기준이 미등록이에요. 도안의 US / UK 표기를 확인한 뒤 해당 열을 읽으세요."
          : `${us ? "미국식(US)" : "영국식(UK)"}으로 등록된 도안이에요. 아래는 이 기준의 기본 약어입니다.`}
      </p>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">코바늘 기본 약어의 한국어 뜻</caption>
          <thead>
            <tr>
              <th scope="col">한국어 뜻</th>
              {(both || us) && <th scope="col">미국식 US</th>}
              {(both || uk) && <th scope="col">영국식 UK</th>}
            </tr>
          </thead>
          <tbody>
            {terms.map(([label, american, british]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {(both || us) && <td>{american}</td>}
                {(both || uk) && <td>{british}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        기본 약어 참고표이며, 이 도안에 필요한 기법 목록은 아니에요. 늘리기·줄이기의 방법과 횟수는
        도안 설명을 따라주세요.
      </p>
      <a
        className="text-link"
        href="https://www.craftyarncouncil.com/standards/crochet-abbreviations"
        target="_blank"
        rel="noopener noreferrer"
      >
        약어 기준: Craft Yarn Council
      </a>
    </div>
  );
}
