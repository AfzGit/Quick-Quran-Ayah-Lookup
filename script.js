// https://quran.com/1/1
const site1 = "https://quran.com/";
// https://quranwbw.com/2#5
const site2 = "https://quranwbw.com/";
// https://tanzil.net/#trans/en.hilali/2:6
// https://tanzil.net/#2:6
const site3 = "https://tanzil.net/";

// copy variables
let fullc, arc, enc;

function copyToClipboard(textToCopy) {
    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
            // alert(`Copied the text: ${textToCopy}`);
            document.getElementById(
                "copy-status"
            ).innerHTML = `✅📋 Copied to Clipboard:</h1><h4>${textToCopy}`;
        })
        .catch((err) => {
            console.error("Error copying text: ", err);
        });
}

async function getAyah(surah, ayah, lang) {
    try {
        // Fetch English translation
        const enResponse = await fetch(
            `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${lang}`
        );
        if (!enResponse.ok) {
            throw new Error("Failed to fetch English Ayah");
        }
        const enData = await enResponse.json();

        // Fetch Arabic text
        const arResponse = await fetch(
            `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar`
        );
        if (!arResponse.ok) {
            throw new Error("Failed to fetch Arabic Ayah");
        }
        const arData = await arResponse.json();

        // return values
        if (enData.code === 200 && arData.code === 200) {
            return {
                en: enData.data.text,
                enName: enData.data.surah.englishName,
                ar: arData.data.text,
                arName: arData.data.surah.name,
            };
        } else {
            throw new Error("Failed to fetch Ayah");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/editions.json
// https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/1/1.json
// getTafsir(1, 2, ar, tafseer-al-saddi)
// getTafsir(1, 2, en, tafisr-ibn-kathir)
// Parameters: (1-114), (1-286), (en, ar, ur), (tafisr-ibn-kathir, tafseer-al-saddi)
async function getTafsir(surah, ayah, lang, tafsirName) {
    try {
        if (lang == "en" && tafsirName == "tafseer-al-saddi") {
            throw new Error(
                "Tafsir Saadi is unavailable in English in Tafsir-API. Only Arabic."
            );
        }

        // Fetch translation
        const tafsirResponse = await fetch(
            `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${lang}-${tafsirName}/${surah}/${ayah}.json`
        );
        if (!tafsirResponse.ok) {
            throw new Error("Failed to fetch English Tafsir");
        }
        const tafsirData = await tafsirResponse.json();

        // return values
        if (tafsirData.code === 200) {
            if (tafsirData.text == "") {
                throw new Error("No Tafsir for this Ayah");
            } else {
                return {
                    tafsir: tafsirData.text,
                };
            }
        } else {
            throw new Error("Failed to fetch Tafsir");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function qurancomFix(surah, ayahNum) {
    if (ayahNum === "" || ayahNum === "0") {
        ayahNum = "";
    } else {
        ayahNum = `/${ayahNum}`;
    }

    surah = `${site1}${surah}${ayahNum}`;

    return surah;
}
function quranwbwFix(surah, ayahNum) {
    if (ayahNum === "" || ayahNum === "0") {
        ayahNum = "";
    } else {
        ayahNum = `#${ayahNum}`;
    }

    surah = `${site2}${surah}${ayahNum}`;

    return surah;
}
function tanzilFix(surah, ayahNum) {
    if (ayahNum === "" || ayahNum === "0") {
        ayahNum = "";
    } else {
        ayahNum = `:${ayahNum}`;
    }

    surah = `${site3}#${surah}${ayahNum}`;
    return surah;
}

function tanzilEnFix(surah, ayahNum) {
    if (ayahNum === "" || ayahNum === "0") {
        ayahNum = "";
    } else {
        ayahNum = `:${ayahNum}`;
    }

    surah = `${site3}#trans/en.hilali/${surah}${ayahNum}`;
    return surah;
}

document.getElementById("urlForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const surahName = document.getElementById("surah").value;
    const lang = document.getElementById("lang").value;
    const surahNum = document.getElementById("Surah-num").value;
    const ayahNum = document.getElementById("ayah-num").value;
    var surah = "";

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

        // add buttons to increment/decrement ayah
        document.getElementById(
            "buttons"
        ).innerHTML = `<button type="submit" onclick="document.getElementById('ayah-num').value = parseInt(document.getElementById('ayah-num').value) - 1;" > Prev </button> - <button type="submit" onclick="document.getElementById('ayah-num').value = parseInt(document.getElementById('ayah-num').value) + 1;" > Next </button>`;

        // QuranCom
        document.getElementById(
            "result"
        ).innerHTML = `<li><a href="${url1}" target="_blank">${url1}</a></li>`;

        //  QuranWBW
        document.getElementById(
            "result"
        ).innerHTML += `<li><a href="${url2}" target="_blank">${url2}</a></li>`;

        // Tanzil
        document.getElementById(
            "result"
        ).innerHTML += `<li><a href="${url3}" target="_blank">${url3}</a> (Translation: <a href="${url4}" target="_blank">Hilali</a>)</li>`;

        // Append and copy ayah
        getAyah(surah, ayahNum, lang)
            .then((result) => {
                // Variables
                enSurahDetails = `Surah ${result.enName}, ${surah}:${ayahNum}`;
                arSurahDetails = `${result.arName} ، ${surah}:${ayahNum}`;
                fullc = `${result.ar} [${arSurahDetails}]\n\n${result.en} [${enSurahDetails}]`;
                arc = `${result.ar} [${arSurahDetails}]`;
                enc = `${result.en} [${enSurahDetails}]`;

                // copy by default
                copyToClipboard(fullc);

                // Ayah Print
                document.getElementById(
                    "quran"
                ).innerHTML = `${enSurahDetails}<br><br>${result.ar} <br><br>${result.en}<br><br>`;

                // buttons to copy
                // full copy
                document.getElementById(
                    "quran"
                ).innerHTML += `<button onclick='copyToClipboard(fullc)'>Copy Full</button>`;

                // Arabic copy
                document.getElementById(
                    "quran"
                ).innerHTML += ` - <button onclick='copyToClipboard(arc)'>Copy Arabic</button>`;

                // English copy
                document.getElementById(
                    "quran"
                ).innerHTML += ` - <button onclick='copyToClipboard(enc)'>Copy Translation</button>`;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                document.getElementById(
                    "quran"
                ).innerHTML = `${error}<br><br>Potential culprits: <br>- Website/Network problem. <br>- Are you sure the Ayah number is correct for that Surah?<br><br>Try the Urls above instead.`;
            });
    }
});
