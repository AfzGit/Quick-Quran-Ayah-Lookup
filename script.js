// https://quran.com/1/1
const site1 = "https://quran.com/";
// https://quranwbw.com/2#5
const site2 = "https://quranwbw.com/";
// https://tanzil.net/#trans/en.hilali/2:6
// https://tanzil.net/#2:6
const site3 = "https://tanzil.net/";

function qurancomFix(surah, ayahNum) {
    if (ayahNum !== "") {
        ayahNum = `/${ayahNum}`;
    } else if (ayahNum == 0 || ayahNum === "") {
        ayahNum = "";
    }

    surah = `${site1}${surah}${ayahNum}`;

    return surah;
}
function quranwbwFix(surah, ayahNum) {
    if (ayahNum !== "") {
        ayahNum = `#${ayahNum}`;
    } else if (ayahNum == 0 || ayahNum === "") {
        ayahNum = "";
    }

    surah = `${site2}${surah}${ayahNum}`;

    return surah;
}
function tanzilFix(surah, ayahNum) {
    if (ayahNum !== "") {
        ayahNum = `:${ayahNum}`;
    } else if (ayahNum == 0 || ayahNum === "") {
        ayahNum = "";
    }

    surah = `${site3}#${surah}:${ayahNum}`;
    return surah;
}
function tanzilEnFix(surah, ayahNum) {
    surah = `${site3}#trans/en.hilali/${surah}:${ayahNum}`;
    return surah;
}

document.getElementById("urlForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const surahName = document.getElementById("surah").value;
    const surahNum = document.getElementById("Surah-num").value;
    const ayahNum = document.getElementById("ayah-num").value;
    var surah = "";

    console.log(`surah: ${surah}, surahNum: ${surahNum}, ayahNum: ${ayahNum}`);

    if (surahName !== "") {
        surah = surahName;
    }
    if (surahNum !== "") {
        surah = surahNum;
    }
    if (surah === "") {
        alert("Please provide Surah Name or number");
        document.getElementById("result").textContent =
            "Please provide Surah Name or number";
    } else if (surah) {
        const url1 = qurancomFix(surah, ayahNum);
        const url2 = quranwbwFix(surah, ayahNum);
        const url3 = tanzilFix(surah, ayahNum);
        const url4 = tanzilEnFix(surah, ayahNum);

        document.getElementById(
            "result"
        ).innerHTML = `<a href="${url1}" target="_blank">${url1}</a>`;

        document.getElementById(
            "result"
        ).innerHTML += `<br><br><a href="${url2}" target="_blank">${url2}</a>`;

        document.getElementById(
            "result"
        ).innerHTML += `<br><br><a href="${url3}" target="_blank">${url3}</a>`;

        document.getElementById(
            "result"
        ).innerHTML += ` (Translation: <a href="${url4}" target="_blank">Hilali</a>)`;
    }
});
