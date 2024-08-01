// https://quran.com/1/1
const site1 = "https://quran.com/";
// https://quranwbw.com/2#5
const site2 = "https://quranwbw.com/";
// https://tanzil.net/#trans/en.hilali/2:6
// https://tanzil.net/#2:6
const site3 = "https://tanzil.net/";

// copy variables
let fullc, arc, enc, tafsirCopy;

// keyboard shortcuts
document.addEventListener("keydown", function (event) {
    if (event.key === "s") {
        document.getElementById("urlForm").scrollIntoView();
    } else if (event.key === "q") {
        document.getElementById("quran").scrollIntoView();
    } else if (event.key === "t") {
        document.getElementById("tafsir-print").scrollIntoView();
    } else if (event.key === "u") {
        document.getElementById("result").scrollIntoView();
    } else if (event.key === "c") {
        document.getElementById("copy-status").scrollIntoView();
    }
});

// table of contents
document.addEventListener("DOMContentLoaded", function () {
    var tocIcon = document.getElementById("tocIcon");
    var toc = document.getElementById("toc");
    var overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    tocIcon.addEventListener("click", function () {
        toc.classList.toggle("open");
        overlay.classList.toggle("open");
    });

    overlay.addEventListener("click", function () {
        toc.classList.remove("open");
        overlay.classList.remove("open");
    });

    // Add event listeners to each TOC link
    var tocLinks = toc.querySelectorAll("a");
    tocLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            toc.classList.remove("open");
            overlay.classList.remove("open");
        });
    });
});

// copy To Clipboard
function copyToClipboard(textToCopy) {
    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
            // print ready
            const printCopy = textToCopy.replace(/\n/g, "<br>");
            document.getElementById(
                "copy-status"
            ).innerHTML = `✔️📋 Copied to Clipboard:<hr class="black-hr">${printCopy}<hr class="black-hr">`;

            // notify
            const notification = document.getElementById("notification");
            notification.style.display = "block";
            notification.innerHTML = `✔️📋 Copied`;
            setTimeout(() => {
                notification.style.display = "none";
            }, 2000); // Hide after 3 seconds
        })
        .catch((err) => {
            console.error("Error copying text: ", err);
        });
}

async function getAyah(surah, ayah, lang) {
    // lang fix for ayah
    switch (lang) {
        case "english":
            lang = "en.hilali";
            break;
        case "urdu":
            lang = "ur.junagarhi";
            break;
        case "arabic":
            lang = "en.hilali";
            break;
    }
    try {
        // console.log( `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${lang}`);
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
// getTafsir(1, 2, ar-tafseer-al-saddi)
// getTafsir(1, 2, entafisr-ibn-kathir)
// Parameters: (1-114), (1-286), (en, ar, ur), (tafisr-ibn-kathir, tafseer-al-saddi)
async function getTafsir(surah, ayah, tafsirName) {
    // Name fix for tafsir
    var trueName;
    switch (tafsirName) {
        case "ar-tafseer-al-saddi":
            trueName = "Tafsir As-Sa'di";
            break;
        case "ar-tafsir-ibn-kathir":
        case "en-tafisr-ibn-kathir":
        case "ur-tafseer-ibn-e-kaseer":
            trueName = "Tafsir Ibn Kathir";
            break;
        default:
            trueName = tafsirName;
    }

    try {
        // Fetch translation
        //console.log( `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${tafsirName}/${surah}/${ayah}.json`);
        const tafsirResponse = await fetch(
            `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${tafsirName}/${surah}/${ayah}.json`
        );
        if (!tafsirResponse.ok) {
            throw new Error("Failed to fetch Tafsir");
        }
        const tafsirData = await tafsirResponse.json();

        // return values
        if (tafsirData.text == "") {
            throw new Error("No Tafsir for this Ayah");
        } else {
            return {
                text: tafsirData.text,
                name: trueName,
            };
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
    const tafsirHTML = document.getElementById("tafsir").value;
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
        ).innerHTML = `<br><button type="submit" onclick="document.getElementById('ayah-num').value = parseInt(document.getElementById('ayah-num').value) - 1;" >⬅️ Prev </button> - <button type="submit" onclick="document.getElementById('ayah-num').value = parseInt(document.getElementById('ayah-num').value) + 1;" > Next ➡️</button>`;

        // URLs
        document.getElementById("result").innerHTML =
            "URLs<hr class='black-hr'>";
        surahAyah = `Quran ${surah}:${ayahNum}`;

        // QuranCom
        document.getElementById(
            "result"
        ).innerHTML += `<li>Quran.com: <a href="${url1}" target="_blank">${surahAyah}</a></li>`;

        //  QuranWBW
        document.getElementById(
            "result"
        ).innerHTML += `<li>QuranWBW: <a href="${url2}" target="_blank">${surahAyah}</a></li>`;

        // Tanzil
        document.getElementById(
            "result"
        ).innerHTML += `<li>Tanzil: <a href="${url3}" target="_blank">${surahAyah}</a> (Translation: <a href="${url4}" target="_blank">Hilali</a>)</li>`;

        // Append and copy ayah
        getAyah(surah, ayahNum, lang)
            .then((result) => {
                // Variables
                enSurahDetails = `Surah ${result.enName}, ${surah}:${ayahNum}`;
                arSurahDetails = `${result.arName} ، ${surah}:${ayahNum}`;
                fullc = `{${result.ar}} [${arSurahDetails}]\n\n{${result.en}} [${enSurahDetails}]`;
                arc = `{${result.ar}} [${arSurahDetails}]`;
                enc = `{${result.en}} [${enSurahDetails}]`;

                // copy by default
                copyToClipboard(fullc);

                // Ayah Print
                document.getElementById(
                    "quran"
                ).innerHTML = `${enSurahDetails}<hr class="black-hr"><p class="arabic">${result.ar}</p>${result.en}<br><hr class="black-hr">`;

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
                ).innerHTML = `${error}<br><br>Potential culprits: <br>- Website/Network problem. <br>- Are you sure the Ayah number is correct for that Surah?<br><br>Try the <a href="#result">URLs below</a> instead.`;
            });

        if (!tafsirHTML == "") {
            // insert Tafsir
            getTafsir(surah, ayahNum, tafsirHTML)
                .then((tafsir) => {
                    document.getElementById("tafsir-print").style.display =
                        "block";

                    // Variables
                    const tafsirDetails = `${tafsir.name}, ${surah}:${ayahNum}`;
                    // newline fixes. double new line looks better
                    const tafsirPrint = tafsir.text.replace(/\n/g, "<br><br>");
                    const tafsirCopyTmp = tafsir.text.replace(/\n/g, "\n\n");
                    tafsirCopy = `${tafsirCopyTmp} \n\n [${tafsirDetails}]`;

                    // tafsir Print
                    document.getElementById(
                        "tafsir-print"
                    ).innerHTML = `${tafsirDetails}<hr class="black-hr">${tafsirPrint}<hr class="black-hr">`;

                    // buttons to copy
                    // full copy
                    document.getElementById(
                        "tafsir-print"
                    ).innerHTML += `<button onclick='copyToClipboard(tafsirCopy)'>Copy Tafsir</button>`;
                })
                .catch((error) => {
                    console.error("Error fetching tafsir: ", error);
                    document.getElementById(
                        "tafsir-print"
                    ).innerHTML = `${error}<br><br>Potential culprits: <br>- Website/Network problem. <br>- Are you sure the Ayah number is correct for that Surah?<br><br>Try the <a href="#result">URLs below</a> instead.`;
                });
        } else {
            document.getElementById("tafsir-print").style.display = "none";
        }
    }
});
