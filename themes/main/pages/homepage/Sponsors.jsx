import React from "react";

export default function Sponsors({ setting: { sponsorsImages } }) {
  return (
    <div className="w-full bg-red-600 text-white monumental text-center py-8">
      <p className="font-bold text-3xl">Contamos con las Mejores Marcas</p>
      <p className="text-base">
        Comprá con las increíbles elecciones de las mejores marcas.
      </p>
      <div className="flex flex-row justify-center space-x-2 2xl:px-96 mt-5">
        {sponsorsImages.map((img, i) => (
          <div
            key={`sponsors${i}`}
            className="h-20 w-28 bg-white justify-center flex"
          >
            <img
              src={img}
              alt="sponsor"
              className="m-auto h-full w-full object-cover"
            ></img>
          </div>
        ))}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 8,
};

export const query = `
  query Query {
    setting {
      sponsorsImages
    }
  }
`;
