import { useState, useEffect, Key } from 'react';
import Image from 'next/image';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

function homePage() {
  const [image, setImage] = useState<File | string>('');
  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<any>(null);
  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    const config = {
      headers: { Accept: 'application/json' },
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/image/retrieve`, config);

        if (res.status === 200) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [updated]);

  const onFileChange = (e: any) => setImage(e.target.files[0]);
  const onTextChange = (e: any) => setText(e.target.value);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('image', image);
    formData.append('text', text);

    const body = formData;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/image/upload`,
        body,
        config
      );
      if (res.status === 201) setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-5 mx-5">
      <h1 className="display-4 mt-5 mb-5">Image Upload App</h1>
      <div className="row">
        <div className="col-5">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Image Upload
              </label>
              <input
                className="form-control"
                type="file"
                name="image"
                onChange={onFileChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label className="form-label" htmlFor="text">
                Text
              </label>
              <input
                className="form-control"
                type="text"
                name="text"
                onChange={onTextChange}
                value={text}
                required
              />
            </div>
            <button className="btn btn-success mt-3" type="submit">
              Upload Image
            </button>
          </form>
        </div>
        <div className="offset-1 col-6">
          <h3>Image In My DB : </h3>
          {images !== null &&
            images !== undefined &&
            images.length > 0 &&
            images.map(
              (image: {
                id: Key | null | undefined;
                image: any;
                alt: string;
              }) => (
                <div className="mb-5" key={image.id}>
                  <Image
                    width={250}
                    height={150}
                    src={`${BASE_URL}${image.image}`}
                    alt={image.alt}
                  />
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}

export default homePage;
