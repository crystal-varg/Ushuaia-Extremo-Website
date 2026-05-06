import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Editor from "@components/common/Editor";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function Page({ page }) {
  // const [isBlog, setIsBlog] = useState(false);

  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const isBlog = url.searchParams.get("blog") == 1;
  //   setIsBlog(isBlog);
  // }, []);

  const [modal, setModal] = useState("close");

  console.log(page);
  

  return (
    <div className="page-width">
      <div className="prose prose-base max-w-none">
        <h1 className="text-center">{page.name}</h1>
        <Editor rows={page.content} />
      </div>
      {page.gallery && page.gallery.length > 0 && (
        <>
          <div className="mt-10">
            <p className="monumental font-bold text-[#63687A]">
              <svg
                className="inline h-full mr-3 mb-1"
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.882 0.898L4.866 0.958C4.773 1.317 4.673 1.698 4.556 2.075C4.308 2.877 4.036 3.474 3.755 3.755C3.474 4.035 2.877 4.308 2.075 4.556C1.697 4.673 1.317 4.773 0.959 4.866L0.898 4.882C0.575 4.965 0.249 5.05 0 5.133V6.867C0.25 6.95 0.575 7.035 0.898 7.118L0.958 7.134C1.317 7.227 1.698 7.327 2.075 7.444C2.877 7.692 3.474 7.964 3.755 8.245C4.035 8.526 4.308 9.123 4.556 9.925C4.673 10.302 4.773 10.683 4.866 11.041L4.882 11.102C4.965 11.425 5.05 11.751 5.133 12H6.867C6.95 11.75 7.035 11.425 7.118 11.102L7.134 11.042C7.227 10.684 7.327 10.302 7.444 9.925C7.692 9.123 7.964 8.526 8.245 8.245C8.526 7.965 9.123 7.692 9.925 7.444C10.302 7.327 10.683 7.227 11.041 7.134L11.102 7.118C11.425 7.035 11.751 6.95 12 6.867V5.133C11.75 5.05 11.425 4.965 11.102 4.882L11.042 4.866C10.6673 4.77121 10.2949 4.66785 9.925 4.556C9.123 4.308 8.526 4.036 8.245 3.755C7.965 3.474 7.692 2.877 7.444 2.075C7.33217 1.70541 7.22881 1.33332 7.134 0.959L7.118 0.898C7.04359 0.596157 6.95988 0.296681 6.867 0L5.133 0C5.05 0.25 4.965 0.575 4.882 0.898ZM5.047 5.047C5.464 4.63 5.77 4.052 6 3.477C6.23 4.052 6.536 4.63 6.953 5.047C7.37 5.464 7.948 5.77 8.523 6C7.948 6.23 7.37 6.536 6.953 6.953C6.536 7.37 6.23 7.948 6 8.523C5.77 7.948 5.464 7.37 5.047 6.953C4.63 6.536 4.052 6.23 3.477 6C4.052 5.77 4.63 5.464 5.047 5.047Z"
                  fill="#63687A"
                />
              </svg>
              Galería de Fotos y Videos
            </p>
          </div>
          <div className="grid gap-2 grid-cols-5 max-sm:grid-cols-1 max-lg:grid-cols-2 mb-5">
            {page.gallery.map((img, index) => (
              <>
                <img
                  onClick={() => {
                    setModal(index);
                  }}
                  key={`excursionImage${index}`}
                  className="w-full aspect-square object-cover cursor-zoom-in"
                  src={img?.url}
                  alt={img?.id}
                ></img>
                {modal == index && (
                  <div className="w-full h-full fixed bg-black top-0 left-0 z-40">
                    <div
                      onClick={() => setModal("close")}
                      className="text-white text-3xl cursor-pointer float-end mr-5 mt-5"
                    >
                      X
                    </div>

                    <div className="h-full flex items-center">
                      <div
                        onClick={() => {
                          var a = modal - 1;
                          if (a < 0) {
                            a = page.gallery.length - 1;
                          }
                          setModal(a);
                        }}
                        className=" text-white text-3xl cursor-pointer ml-5"
                      >
                        {"<"}
                      </div>
                      <img
                        src={img?.url}
                        className="max-w-[50vw] max-h-[80vh] m-auto"
                      ></img>
                      <div
                        onClick={() => {
                          var a = modal + 1;
                          if (a >= page.gallery.length) {
                            a = 0;
                          }
                          setModal(a);
                        }}
                        className=" text-white text-3xl cursor-pointer"
                      >
                        {">"}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Page.propTypes = {
  page: PropTypes.shape({
    content: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 1,
};

export const query = `
  query Query {
    page: cmsPage(id: getContextValue("pageId")) {
      name
      content
      gallery {
        url
        id: uuid
      }
    }
  }
`;
