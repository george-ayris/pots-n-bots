export function hideElement(id: string) {
  document.getElementById(id)!.style["display"] = "none";
}

export function showElement(id: string, display = "block") {
  document.getElementById(id)!.style["display"] = display;
}

export function setSelectOptions(id: string, options: string[], selectedOption?: string) {
  const selectTag = document.getElementById(id) as HTMLSelectElement;
  removeOptions(selectTag);

  options.forEach((option, i) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.innerHTML = option;
    if (!selectedOption && i === 0 || selectedOption === option) opt.setAttribute('selected', 'true')
    selectTag!.append(opt);
  });
}

function removeOptions(selectElement: HTMLSelectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}