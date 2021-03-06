import React, { useState, useEffect } from "react";
import style from "./style.module.css";


interface ShrinkedUrlI {
  full: string,
  short: string
}


function validateURL(URL: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(URL);
}

const Form = () => {
  const [urlList, setUrlList] = useState<ShrinkedUrlI[]>([{full: "", short:""}]);
  const [displayList, setDisplayList] = useState(false);
  const [fullURL, setFullURL] = useState("");
  const [customURL, setCustomURL] = useState("");
  const [customUrlMode, setCustomUrlMode] = useState(false);
  const onChangeFullURL = (event: { target: { value: React.SetStateAction<string>; }; }) => setFullURL(event.target.value);
  const onChangeCustomURL = (event: { target: { value: React.SetStateAction<string>; }; }) => setCustomURL(event.target.value);
  const onChangeShrinkMode = () => {
    setCustomUrlMode(!customUrlMode);
  };

  const getUrlList = async () => {
    try {
      const response = await fetch("http://localhost:5000/urlsList");
      const jsonData = await response.json();
      setUrlList(jsonData);
    } catch (error) {}
  };

  const shrinkURL = async (fullUrl: string, shorUrl: string) => {
    try {
      if (validateURL(fullUrl)) {
        if (customUrlMode) {
          const body = { fullUrl, shorUrl };
          const shrinkURL = await fetch(
            "http://localhost:5000/shrinkCustomUrl",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
        } else {
          const body = { fullUrl };
          const shrinkURL = await fetch("http://localhost:5000/shrinkUrl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
        setDisplayList(true);
        setFullURL("");
        setCustomURL("");
        window.location.href = "/";
      } else {
        alert("?????????????????? ???????????????????????? ???????????????? ???????????? !");
      }
    } catch (error) {
      console.log("??????-???? ?????????? ???? ??????");
      console.log(error);
    }
  };

  useEffect(() => {
    getUrlList();
  }, []);

  if (!displayList) {
    return (
      <div className={style.wrapper}>
        <div className={style.form}>
          <div className={style.logo}>
            <p className={style.icon}>??????</p>
            <p className={style.title}>URL ??????????????????</p>
          </div>
          <div className={style.label}>
            <div>
              <p className={style.top}>?????????????????? ?? ???????? ?????????? ???????? URL</p>
            </div>
            <div>
              <p className={style.bottom}>
                ???? ?????? ???????????? ?????????? ???????????? ???????????????? URL
              </p>
            </div>
          </div>
          <div className={style.input}>
            <div>
              <input
                placeholder="???????????? URL"
                className={style.inputComponent}
                type="text"
                key="full"
                value={fullURL}
                onChange={onChangeFullURL}
              />
            </div>
            <div className={style.padding_small}>
              <p className={style.inputLabel_checkbox}>
                ???????????? ???????????????????????????????? ???????????????? URL
              </p>
              <input
                type="checkbox"
                id="customURL"
                name="customURLcheck"
                className={style.checkbox}
                onClick={onChangeShrinkMode}
              ></input>
            </div>
            <div>
              {customUrlMode ? (
                <div className={style.input}>
                  <input
                    placeholder="???????????????? URL"
                    className={style.inputComponent}
                    type="text"
                    key="custom"
                    value={customURL}
                    onChange={onChangeCustomURL}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className={style.button}>
            <button
              className={
                (customUrlMode && customURL && fullURL) ||
                (!customUrlMode && fullURL)
                  ? style.buttonComponent
                  : style.buttonComponent_disabled
              }
              onClick={() => shrinkURL(fullURL, customURL)}
              disabled={
                !(
                  (customUrlMode && customURL.length>0) ||
                  (!customUrlMode && fullURL)
                )
              }
            >
              ?????????????????? URL
            </button>
          </div>
        </div>
        <div className={style.absolute}>
          <button
            className={style.button_viewMode}
            onClick={() => setDisplayList(!displayList)}
          >
            {displayList ? "???? ??????????????" : "???????????? URL"}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.wrapper}>
        <div className={style.form}>
          <div className={style.table}>
            <table>
              <thead>
                <tr>
                  <th>???????????? URL</th>
                  <th>?????????????????????? URL</th>
                </tr>
              </thead>
              <tbody>
                {urlList.map((url) => {
                  return (
                    <tr>
                      <td className={style.fullURL}>
                        <a href={url.full}> {url.full} </a>
                      </td>
                      <td className={style.shortURL}>
                        <a href={`http://localhost:5000//${url.short}`} >{url.short} </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={style.absolute}>
          <button
            className={style.button_viewMode}
            onClick={() => setDisplayList(!displayList)}
          >
            {displayList ? "???? ??????????????" : "???????????? URL"}
          </button>
        </div>
      </div>
    );
  }
};

export default Form;
