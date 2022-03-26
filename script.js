const countries_count = document.querySelector(".countries-count");
const description = document.querySelector(".text");
const data = document.querySelector(".data");
async function fetchData() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const countries_data = await response.json();
  console.log(countries_data);

  // sort data according to population
  let countries_sort_popu = [...countries_data];
  countries_sort_popu = countries_sort_popu.sort(
    (a, b) => b.population - a.population
  );

  //calculating world population
  let world_population = countries_sort_popu.reduce(
    (acc, cur) => acc + cur.population,
    0
  );

  //creating population object
  let countries_slice = countries_sort_popu.slice(0, 9);
  let population_data = countries_slice.reduce(
    (acc, { name, population }) => {
      acc.push({
        name: name.common,
        population: population,
      });
      return acc;
    },
    [{ name: "World", population: world_population }]
  );

  //getting languages array
  let languages_arr = [];
  for (let { languages } of countries_data) {
    if (languages) {
      for (let language of Object.values(languages)) {
        languages_arr.push(language);
      }
    }
  }
  let languages_arr_noduplicate = new Set(languages_arr);
  let languages_data = [];
  for (let language of languages_arr_noduplicate) {
    let filterLang = languages_arr.filter((lang) => lang == language);
    languages_data.push({
      language: language,
      count: filterLang.length,
    });
  }

  //creating languages object
  languages_data = languages_data
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  //make language data array to text
  let lang_text = languages_data
    .map(({ language, count }) => {
      return showData(language, count);
    })
    .join("\n");

  // make population_data array to text
  let population_text = population_data
    .map(({ name, population }) => {
      return showData(name, population, (population * 100) / world_population);
    })
    .join("\n");

  //make default data show
  countries_count.classList.remove(
    "skeleton",
    "skeleton-text",
    "skeleton-text-short"
  );
  description.classList.remove(
    "skeleton",
    "skeleton-text",
    "skeleton-text-short"
  );
  countries_count.textContent = `Currently we have ${countries_data.length} countries.`;
  description.textContent = "10 most populated countries in the world";
  data.innerHTML = population_text;

  // make click button work
  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btns.forEach((btn) => {
        btn.classList.remove("active");
        e.currentTarget.classList.add("active");
      });

      let value = e.currentTarget.value;
      if (value == "population") {
        description.textContent = "10 most populated countries in the world";
        data.innerHTML = population_text;
      } else if (value == "languages") {
        description.textContent = "10 most spoken languages in the world";
        data.innerHTML = lang_text;
      }
    });
  });
}

fetchData().catch((err) => console.log(err));

//adding skeleton loading effect
let template = document.querySelector(".template");
for (let i = 0; i < 10; i++) {
  data.append(template.content.cloneNode(true));
}

// showing data in browser
function showData(name, value, percent = value) {
  return `<div class="row d-flex align-items-center justify-content-center mb-4">
  <div class="col-sm-2 col-12">
    <p>${name}</p>
  </div>
  <div class="col-sm-8 col-12">
    <div class="progress">
      <div
        class="progress-bar bg-warning"
        role="progressbar"
        style="width: ${percent}%"
        aria-valuenow="${percent}"
        aria-valuemin="0"
        aria-valuemax="100"
      >
      </div>
    </div>
  </div>
  <div class="col-sm-2 col-12"><p>${value}</p></div>
</div>`;
}
