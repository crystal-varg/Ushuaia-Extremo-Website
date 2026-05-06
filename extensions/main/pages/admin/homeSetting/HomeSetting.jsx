import React from "react";
import { toast } from "react-toastify";
import { Field } from "@components/common/form/Field";
import { Form } from "@components/common/form/Form";
import { Card } from "@components/admin/cms/Card";
import SettingMenu from "@components/admin/setting/SettingMenu";
import Area from "@components/common/Area";
import FileBrowser from "@components/common/form/fields/editor/FileBrowser";
import uniqid from "uniqid";
import { get } from "@evershop/evershop/src/lib/util/get";
import Spinner from "@components/common/Spinner";
import Button from "@components/common/form/Button";
import "./HomeSetting.scss";

function Image({
  image,
  removeImage,
  titles,
  index,
  linksChanged,
  titlesChanged,
  links = true,
  title,
  link,
}) {
  return (
    <div className="image grid-item">
      <span
        className="remove cursor-pointer text-critical fill-current"
        onClick={() => removeImage(image, index)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-trash-2"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </span>
      <div className="img mx-1">
        <img src={image} alt="" />
        {titles ? (
          <input
            type="text"
            value={title}
            onChange={(e) => {
              if (e.target.value.includes(",")) {
                e.target.value = e.target.value.replaceAll(",", "");
              }
              titlesChanged(e.target.value, index);
            }}
            className="!border-black border border-1"
            placeholder="Titulo"
          ></input>
        ) : (
          <></>
        )}
        {links ? (
          <input
            type="text"
            value={link}
            onChange={(e) => {
              if (e.target.value.includes(",")) {
                e.target.value = e.target.value.replaceAll(",", "");
              }
              linksChanged(e.target.value, index);
            }}
            className="!border-black border border-1"
            placeholder="Link"
          ></input>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

function Upload({ addImage, productImageUploadUrl, disabled }) {
  const [uploading, setUploading] = React.useState(false);

  const onChange = (e) => {
    setUploading(true);
    e.persist();
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i += 1) {
      formData.append("images", e.target.files[i]);
    }
    const targetPath = `catalog/${
      Math.floor(Math.random() * (9999 - 1000)) + 1000
    }/${Math.floor(Math.random() * (9999 - 1000)) + 1000}`;
    formData.append("targetPath", targetPath);
    fetch(productImageUploadUrl + targetPath, {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (
          !response.headers.get("content-type") ||
          !response.headers.get("content-type").includes("application/json")
        ) {
          throw new TypeError("Something wrong. Please try again");
        }

        return response.json();
      })
      .then((response) => {
        if (!response.error) {
          addImage(
            get(response, "data.files", []).map((i) => ({
              id: uniqid(),
              url: i.url,
              path: i.path,
            }))
          );
        } else {
          toast.error(get(response, "error.message", "Failed!"));
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        e.target.value = null;
        setUploading(false);
      });
  };

  const id = uniqid();
  return (
    <div className="uploader grid-item">
      <div className="uploader-icon">
        <label htmlFor={id}>
          {uploading ? (
            <Spinner width={25} height={25} />
          ) : !disabled ? (
            <svg
              style={{ width: "30px", height: "30px" }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <></>
          )}
        </label>
      </div>
      <div className="invisible">
        <input
          disabled={disabled}
          id={id}
          type="file"
          multiple
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function Images({
  id,
  images,
  addImage,
  removeImage,
  productImageUploadUrl,
  maxImages,
  gridCols,
  titles,
  links,
  linksChanged,
  titlesChanged,
}) {
  return (
    <div id={id}>
      <Upload
        disabled={images.length >= maxImages}
        addImage={addImage}
        productImageUploadUrl={productImageUploadUrl}
      />
      <div
        className="max-h-96 overflow-auto grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols || 3}, minmax(0, 1fr))`,
        }}
      >
        {images.map((image, index) => (
          <Image
            links={links != undefined}
            link={links?.[index]}
            title={titles?.[index]}
            linksChanged={linksChanged}
            titlesChanged={titlesChanged}
            index={index}
            titles={titles != undefined}
            key={`images2-${index}`}
            removeImage={removeImage}
            image={image}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeSetting({ saveSettingApi, setting, uploadApi }) {
  const [sliderImages, setSliderImages] = React.useState(
    setting?.sliderImages ? setting.sliderImages : []
  );
  const [sliderImagesLinks, setSliderImagesLinks] = React.useState(
    setting?.sliderImagesLinks ? setting.sliderImagesLinks : []
  );
  const [rentalImages, setRentalImages] = React.useState(
    setting?.rentalImages ? setting.rentalImages : []
  );
  const [rentalImagesTitles, setRentalImagesTitles] = React.useState(
    setting?.rentalImagesTitles ? setting.rentalImagesTitles : []
  );
  const [rentalImagesLinks, setRentalImagesLinks] = React.useState(
    setting?.rentalImagesLinks ? setting.rentalImagesLinks : []
  );

  const [bykesAndAccesoriesImages, setBykesAndAccesoriesImages] =
    React.useState(
      setting?.bykesAndAccesoriesImages ? setting.bykesAndAccesoriesImages : []
    );

  const [bykesAndAccesoriesImagesTitles, setBykesAndAccesoriesImagesTitles] =
    React.useState(
      setting?.bykesAndAccesoriesImagesTitles
        ? setting.bykesAndAccesoriesImagesTitles
        : []
    );

  const [bykesAndAccesoriesImagesLinks, setBykesAndAccesoriesImagesLinks] =
    React.useState(
      setting?.bykesAndAccesoriesImagesLinks
        ? setting.bykesAndAccesoriesImagesLinks
        : []
    );

  const [otherServicesImages, setOtherServicesImages] = React.useState(
    setting?.otherServicesImages ? setting.otherServicesImages : []
  );

  const [otherServicesImagesLinks, setOtherServicesImagesLinks] =
    React.useState(
      setting?.otherServicesImagesLinks ? setting.otherServicesImagesLinks : []
    );
  const [sponsorsImages, setSponsorsImages] = React.useState(
    setting?.sponsorsImages ? setting.sponsorsImages : []
  );

  return (
    <div className="main-content-inner">
      <div className="grid grid-cols-6 gap-x-8 grid-flow-row ">
        <div className="col-span-2">
          <SettingMenu />
        </div>
        <div className="col-span-4">
          <Form
            method="POST"
            id="homeSetting"
            action={saveSettingApi}
            onSuccess={(response) => {
              if (!response.error) {
                toast.success("Setting saved");
              } else {
                toast.error(response.error.message);
              }
            }}
          >
            <Card>
              <Card.Session title="Main Slider Images">
                <Images
                  id="images"
                  images={sliderImages}
                  links={sliderImagesLinks}
                  linksChanged={(val, index) => {
                    const array = [...sliderImagesLinks];
                    array[index] = val;
                    setSliderImagesLinks(array);
                  }}
                  addImage={(imageArray) => {
                    setSliderImagesLinks([...sliderImagesLinks, ""]);
                    setSliderImages(
                      sliderImages.concat(imageArray.map((i) => i.url))
                    );
                  }}
                  removeImage={(imageId, index) => {
                    setSliderImagesLinks(
                      sliderImagesLinks.filter((i, ind) => ind !== index)
                    );
                    setSliderImages(sliderImages.filter((i) => i !== imageId));
                  }}
                  productImageUploadUrl={uploadApi}
                />
                <Field
                  type="hidden"
                  value={sliderImages}
                  name="sliderImages"
                ></Field>
                <Field
                  type="hidden"
                  value={sliderImagesLinks}
                  name="sliderImagesLinks"
                ></Field>
              </Card.Session>
              <Card.Session title="RENTAL USHUAIA Images">
                <Images
                  id="images"
                  gridCols={4}
                  images={rentalImages}
                  titles={rentalImagesTitles}
                  links={rentalImagesLinks}
                  linksChanged={(val, index) => {
                    const array = [...rentalImagesLinks];
                    array[index] = val;
                    setRentalImagesLinks(array);
                  }}
                  titlesChanged={(val, index) => {
                    const array = [...rentalImagesTitles];
                    array[index] = val;
                    setRentalImagesTitles(array);
                  }}
                  addImage={(imageArray) => {
                    setRentalImages(
                      rentalImages.concat(imageArray.map((i) => i.url))
                    );
                    setRentalImagesLinks([...rentalImagesLinks, ""]);
                    setRentalImagesTitles([...rentalImagesTitles, ""]);
                  }}
                  removeImage={(imageId, index) => {
                    setRentalImages(rentalImages.filter((i) => i !== imageId));
                    setRentalImagesLinks(
                      rentalImagesLinks.filter((i, ind) => ind !== index)
                    );
                    setRentalImagesTitles(
                      rentalImagesTitles.filter((i, ind) => ind !== index)
                    );
                  }}
                  productImageUploadUrl={uploadApi}
                />
                <Field
                  type="hidden"
                  value={rentalImages}
                  name="rentalImages"
                ></Field>
                <Field
                  type="hidden"
                  value={rentalImagesLinks}
                  name="rentalImagesLinks"
                ></Field>
                <Field
                  type="hidden"
                  value={rentalImagesTitles}
                  name="rentalImagesTitles"
                ></Field>
              </Card.Session>
              <Card.Session title="BICICLETERIA Y ACCESORIOS Images">
                <Images
                  id="images"
                  gridCols={4}
                  titles={bykesAndAccesoriesImagesTitles}
                  links={bykesAndAccesoriesImagesLinks}
                  images={bykesAndAccesoriesImages}
                  linksChanged={(val, index) => {
                    const array = [...bykesAndAccesoriesImagesLinks];
                    array[index] = val;
                    setBykesAndAccesoriesImagesLinks(array);
                  }}
                  titlesChanged={(val, index) => {
                    const array = [...bykesAndAccesoriesImagesTitles];
                    array[index] = val;
                    setBykesAndAccesoriesImagesTitles(array);
                  }}
                  addImage={(imageArray) => {
                    setBykesAndAccesoriesImages(
                      bykesAndAccesoriesImages.concat(
                        imageArray.map((i) => i.url)
                      )
                    );
                    setBykesAndAccesoriesImagesTitles([
                      ...bykesAndAccesoriesImagesTitles,
                      "",
                    ]);
                    setBykesAndAccesoriesImagesLinks([
                      ...bykesAndAccesoriesImagesLinks,
                      "",
                    ]);
                  }}
                  removeImage={(imageId, index) => {
                    setBykesAndAccesoriesImages(
                      bykesAndAccesoriesImages.filter((i) => i !== imageId)
                    );
                    setBykesAndAccesoriesImagesTitles(
                      bykesAndAccesoriesImagesTitles.filter(
                        (i, ind) => ind !== index
                      )
                    );
                    setBykesAndAccesoriesImagesLinks(
                      bykesAndAccesoriesImagesLinks.filter(
                        (i, ind) => ind !== index
                      )
                    );
                  }}
                  productImageUploadUrl={uploadApi}
                />
                <Field
                  type="hidden"
                  value={bykesAndAccesoriesImages}
                  name="bykesAndAccesoriesImages"
                ></Field>
                <Field
                  type="hidden"
                  value={bykesAndAccesoriesImagesLinks}
                  name="bykesAndAccesoriesImagesLinks"
                ></Field>
                <Field
                  type="hidden"
                  value={bykesAndAccesoriesImagesTitles}
                  name="bykesAndAccesoriesImagesTitles"
                ></Field>
              </Card.Session>
              <Card.Session title="Otros Servicios Images">
                <Images
                  id="images"
                  gridCols={4}
                  links={otherServicesImagesLinks}
                  images={otherServicesImages}
                  linksChanged={(val, index) => {
                    const array = [...otherServicesImagesLinks];
                    array[index] = val;
                    setOtherServicesImagesLinks(array);
                  }}
                  addImage={(imageArray) => {
                    setOtherServicesImages(
                      otherServicesImages.concat(imageArray.map((i) => i.url))
                    );
                    setBykesAndAccesoriesImagesLinks([
                      ...bykesAndAccesoriesImagesLinks,
                      "",
                    ]);
                  }}
                  removeImage={(imageId, index) => {
                    setOtherServicesImages(
                      otherServicesImages.filter((i) => i !== imageId)
                    );
                    setBykesAndAccesoriesImagesLinks(
                      bykesAndAccesoriesImagesLinks.filter(
                        (i, ind) => ind !== index
                      )
                    );
                  }}
                  productImageUploadUrl={uploadApi}
                />
                <Field
                  type="hidden"
                  value={otherServicesImages}
                  name="otherServicesImages"
                ></Field>
                <Field
                  type="hidden"
                  value={otherServicesImagesLinks}
                  name="otherServicesImagesLinks"
                ></Field>
              </Card.Session>
              <Card.Session title="Sponsors Images">
                <Images
                  id="images"
                  gridCols={6}
                  images={sponsorsImages}
                  addImage={(imageArray) =>
                    setSponsorsImages(
                      sponsorsImages.concat(imageArray.map((i) => i.url))
                    )
                  }
                  removeImage={(imageId) =>
                    setSponsorsImages(
                      sponsorsImages.filter((i) => i !== imageId)
                    )
                  }
                  productImageUploadUrl={uploadApi}
                />
                <Field
                  type="hidden"
                  value={sponsorsImages}
                  name="sponsorsImages"
                ></Field>
              </Card.Session>
            </Card>
          </Form>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    browserApi: url(routeId: "fileBrowser", params: [{key: "0", value: ""}])
    deleteApi: url(routeId: "fileDelete", params: [{key: "0", value: ""}])
    uploadApi: url(routeId: "imageUpload", params: [{key: "0", value: ""}])
    folderCreateApi: url(routeId: "folderCreate")
    saveSettingApi: url(routeId: "saveSetting")
    setting {
      sliderImages
      sliderImagesLinks
      rentalImages
      rentalImagesTitles
      rentalImagesLinks
      bykesAndAccesoriesImages
      bykesAndAccesoriesImagesTitles
      bykesAndAccesoriesImagesLinks
      otherServicesImages
      otherServicesImagesLinks
      sponsorsImages
    }
  }
`;
