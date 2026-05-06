class ButtonEditor {
  static get toolbox() {
    return {
      title: "Itinerario",
    };
  }

  constructor({ data }) {
    this.data = {
      url: data.url || "",
      text: data.text || "",
    };
  }

  render() {
    const buttonText = this.data.buttonText || "Descargar Itinerario";
    const text =
      this.data.text ||
      "A tener en cuenta: los itinerarios están sujetos a cambios.";
    const url = this.data.url || "";

    const container = document.createElement("div");

    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("contenteditable", "true");
    buttonDiv.classList = [
      "text-white",
      "bg-[#1f1f1f]",
      "monumental",
      "px-3",
      "py-2",
      "rounded-[12px]",
      "h-fit",
      "w-fit",
      "inline-block",
      "boton",
    ].join(" ");
    buttonDiv.innerText = buttonText;

    const div = document.createElement("div");
    div.classList = [
      "text-[#63687A]",
      "monumental",
      "px-5",
      "py-2",
      "h-fit",
      "w-full",
      "inline-block",
    ].join(" ");

    const icon = document.createElement("img");
    icon.classList = ["inline-block"].join(" ");
    icon.src = "/images/vector3.svg";

    const p = document.createElement("p");
    p.setAttribute("contenteditable", "true");
    p.classList = ["inline-block"].join(" ");
    p.innerText = text;
    div.appendChild(icon);
    div.appendChild(p);

    const urlInput = document.createElement("input");
    urlInput.classList = ["mr-3", "p-2", "border", "border-black"].join(" ");
    urlInput.placeholder = "URL del itinerario";
    urlInput.value = url;

    div.appendChild(buttonDiv);
    container.appendChild(div);
    container.appendChild(urlInput);

    return container;
  }

  save(blockContent) {
    const url = blockContent.querySelector("input").value;
    const text = blockContent.querySelector("[contenteditable]").innerText;
    const buttonText = blockContent.querySelector(".boton").innerText;

    return Object.assign(this.data, {
      url,
      text,
      buttonText,
    });
  }
}

export default ButtonEditor;
