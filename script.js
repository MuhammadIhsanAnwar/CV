const defaultData = {
  name: "Nama Lengkap",
  job: "Web Developer / UI Designer",
  avatar: "A",
  about: "Saya adalah seorang pengembang web yang tertarik pada UI futuristik, teknologi modern, dan pengalaman pengguna.",
  education: `<li>S1 Teknologi Informasi – Universitas Contoh (2022 - 2026)</li>
              <li>SMA Negeri Contoh (2019 - 2022)</li>`,
  skills: `<li>HTML, CSS, JavaScript</li>
           <li>UI/UX Design</li>
           <li>Git & GitHub</li>
           <li>Responsive Web Design</li>`
};

function resetCV() {
  document.getElementById("name").innerText = defaultData.name;
  document.getElementById("job").innerText = defaultData.job;
  document.getElementById("avatar").innerText = defaultData.avatar;
  document.getElementById("about").innerText = defaultData.about;
  document.getElementById("education").innerHTML = defaultData.education;
  document.getElementById("skills").innerHTML = defaultData.skills;
}

function downloadCV() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cv-futuristik.html";
  a.click();
}

// Avatar otomatis dari huruf pertama nama
document.getElementById("name").addEventListener("input", function () {
  const text = this.innerText.trim();
  document.getElementById("avatar").innerText = text ? text[0].toUpperCase() : "A";
});
