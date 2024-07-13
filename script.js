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

async function getayah(surah, ayah) {
    try {
        // Fetch English translation
        const enResponse = await fetch(
            `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.hilali`
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

        if (enData.code === 200 && arData.code === 200) {
            return {
                en: enData.data.text,
                ar: arData.data.text,
            };
        } else {
            throw new Error("Failed to fetch Ayah");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
// https://quran.com/1/1
const site1 = "https://quran.com/";
// https://quranwbw.com/2#5
const site2 = "https://quranwbw.com/";
// https://tanzil.net/#trans/en.hilali/2:6
// https://tanzil.net/#2:6
const site3 = "https://tanzil.net/";

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
        getayah(surah, ayahNum)
            .then((result) => {
                document.getElementById(
                    "quran"
                ).innerHTML = `<br>${result.ar} <br> ${result.en}<br><br>`;

                // buttons to copy
                document.getElementById(
                    "quran"
                ).innerHTML += `<button onclick='copyToClipboard("${result.ar}\\n\\n${result.en}")'>Copy Full</button>`;

                document.getElementById(
                    "quran"
                ).innerHTML += ` - <button onclick='copyToClipboard("${result.ar}")'>Copy Arabic</button>`;

                document.getElementById(
                    "quran"
                ).innerHTML += ` - <button onclick='copyToClipboard("${result.en}")'>Copy English</button>`;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                document.getElementById(
                    "quran"
                ).innerHTML += `Error fetching Ayah. Website problem or Net problem.`;
            });
    }
});
