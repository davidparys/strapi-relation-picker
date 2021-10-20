import { Label, Separator } from "@buffetjs/core";
import React, { useEffect, useState } from "react";
import { InputSelect, request } from "strapi-helper-plugin";
import styled from "styled-components";

const DivWrapper = styled.div`
  margin: 15px 0;
`;
/*
The RelationPicker component is a reusable component that allows you to select a page or blog post from the content manager.

Args:
  value: The value of the input.
  onChange: The function that will be called when the value changes.
  name: The name of the field.
Returns:
  The return is a function that is being called in the render method.
*/

const RelationPicker = ({ value, onChange, name }) => {
  console.log("the current value is: ", value);
  const [loaded, setLoaded] = useState(false);
  const [queryDB, setqueryDB] = useState(undefined);
  const [findType, setfindType] = useState(
    value?.value ? value.value : undefined
  );
  const [jsonType, setjsonType] = useState(
    value?.value ? { value: value.value, type: value.Type } : undefined
  );

  useEffect(() => {
    const fetchConnections = async () => {
      if (value.value && value.type && !loaded) {
        await handleFindType(value.value, value.type);
        setLoaded(true);
      }
    };
    fetchConnections();
  }, []);
  const [findItem, setFindItem] = useState(value ? value.slug : undefined);
  // setjsonType({ value: typeName, type: type });

  const namePath = name.split(".");
  const popPath = namePath.pop();

  const newPath = namePath.join(".");

  console.log("find path", popPath, namePath);
  console.log("new path", newPath);
  const handleFindItem = (value, type) => {
    if (type === "multiple") {
      console.log("multiple handle items", value, name);
      onChange({
        target: {
          name: `${newPath}.hrefLink`,
          value: value,
        },
      });
      onChange({
        target: {
          name: `${newPath}.pageType`,
          value: jsonType.value,
        },
      });
      onChange({
        target: {
          name,
          value: JSON.stringify({
            slug: value,
            value: jsonType.value,
            type: jsonType.type,
          }),
        },
      });
    } else {
      console.log("else is running");
      onChange({
        target: {
          name: `${newPath}.pageType`,
          value: value,
        },
      });
      onChange({
        target: {
          name: `${newPath}.hrefLink`,
          value: value,
        },
      });
      onChange({
        target: {
          name,
          value: JSON.stringify({
            slug: null,
            value: value,
            type: "single",
          }),
        },
      });
    }

    return setFindItem(value);
  };

  // useEffect(() => {
  //   if (findType) {

  //   }
  // }, []);
  const handleFindType = async (typeName, type) => {
    if (!typeName) return null;
    if (typeName === "unset") {
      console.log("unset is running");
      setfindType("");
      setqueryDB(null);
      setjsonType(null);
      onChange({
        target: {
          name: `${newPath}.pageType`,
          value: null,
        },
      });
      onChange({
        target: {
          name: `${newPath}.hrefLink`,
          value: null,
        },
      });
      onChange({
        target: {
          name,
          value: null,
        },
      });
      return;
    }
    console.log("the type for:", typeName, "is ", type);
    if (type === "single") {
      const query = await request(
        `/content-manager/single-types/application::${typeName}.${typeName}?_locale=de-DE`,
        { method: "GET" }
      );

      setqueryDB(null);
      const valueS = query.slug;
      setjsonType({ value: typeName, slug: valueS, type: "single" });
      console.log("the json after:", jsonType);
      onChange({
        target: {
          name: `${newPath}.pageType`,
          value: typeName,
        },
      });
      handleFindItem(valueS, "single");
    }
    if (type === "multiple") {
      const query = await request(
        `/content-manager/collection-types/application::${typeName}.${typeName}?&_locale=de-DE`,
        { method: "GET" }
      );

      if (query.results.length > 0) {
        setqueryDB(query.results);
        setjsonType({ value: typeName, type: type });
      }
    }

    return setfindType(typeName);
  };

  const isMultipleType = Boolean(
    typeof queryDB === "object" && queryDB?.length > 0
  );
  const defaultValues = [{ value: "unset", label: "Select an Option" }];
  return (
    <DivWrapper>
      <Label htmlFor="types" message="Select a type" />
      <InputSelect
        style={{ width: "100%", height: "32px", marginTop: "-1px" }}
        name="types"
        onChange={(v) => {
          handleFindType(
            v.target.value,
            v.target.value === "pages"
              ? "multiple"
              : v.target.value === "blogs"
              ? "multiple"
              : "single"
          );
        }}
        selectOptions={defaultValues.concat(["homepage", "pages", "blogs"])}
        value={findType}
      />
      {isMultipleType && (
        <>
          <Separator label="And" style={{ padding: "15px 0" }} />
          <Label htmlFor="types" message="Select a single item" />
          <InputSelect
            style={{ width: "100%", height: "32px", marginTop: "-1px" }}
            name="findItem"
            name="Single"
            onChange={(value) => {
              handleFindItem(value.target.value, "multiple");
            }}
            onBlur={(value) => {
              handleFindItem(value.target.value, "multiple");
            }}
            selectOptions={defaultValues.concat(
              queryDB.map((items) => ({
                value: items.slug,
                label: items.title,
              }))
            )}
            value={findItem}
          />
        </>
      )}
    </DivWrapper>
  );
};

export default RelationPicker;

// console.dir(onChange);
//   const [showPicker, setShowPicker] = useState(false);
//   const [color, setColor] = useState(value ? value : "#FFFFFF");

//   /**
//    * Makes the color value available to the document for database update
//    * @param {string} colorValue - in hex format
//    */
//   const updateColorValue = (colorValue) => {
//     console.log("the color value", colorValue);
//     // onChange({ target: { name: "color", value: colorValue } });
//     onChange({ target: { name, value: colorValue } });
//   };

// createStrapi

//   /**
//    * Assign a default color value if the document doesn't have one yet
//    */
//   useEffect(() => {
//     if (!value) {
//       updateColorValue(color);
//     }
//   }, []);

//   /**
//    * Handle color change from the the color picker
//    * @param {string} color - in hex format
//    */
//   const handleChangeComplete = (color) => {
//     setColor(color.hex);
//     updateColorValue(color.hex);
//   };
//   return (
//     <div>
//       <Title>Color Tag</Title>
//       <ColorWindow color={color} onClick={() => setShowPicker(true)} />
//       {showPicker ? (
//         <PopOver>
//           <Cover onClick={() => setShowPicker(false)} />
//           <ChromePicker color={color} onChange={handleChangeComplete} />
//         </PopOver>
//       ) : null}
//     </div>
//   );
