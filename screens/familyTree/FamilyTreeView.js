import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { AppContext } from "../../AppContext";
import FamilyTree from "./FamilyTree";
import AxiosInstance from "../../network/AxiosInstance";
import AppHeader from "../../components/AppHeader";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { APP_CONSTANTS } from "../../helper/constant";

const FamilyMap = () => {
  const [data, setData] = useState(null);
  const { setIsLoading } = useContext(AppContext);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance().get("/relationships/");
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const generatePDF = async () => {
    if (data) {
      const html = createFamilyTreeHTML(data);
      try {
        const file = await RNHTMLtoPDF.convert({
          html,
          fileName: 'FamilyTree',
          width: 4000,
          height: 792,
        });
        
        const shareOptions = {
          title: 'Share PDF',
          url: `file://${file.filePath}`,
          type: 'application/pdf',
        };

        await Share.open(shareOptions);
      } catch (error) {
        console.error("Failed to generate or share PDF:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        right={{
          icon: "print",
          onPress: generatePDF,
        }}
        back
        title={"Family Tree"}
      />
      <View style={{ flex: 1 }}>{data && <FamilyTree data={data} />}</View>
    </View>
  );
};

export default FamilyMap;

const createFamilyTreeHTML = (data) => {
  const renderMember = (member) => {
    const spouseHtml = member.spouse_name
      ? `
      <div class="spouse">
        <img src="${
          member.spouse_profile_picture || APP_CONSTANTS.defaultAvatar
        }" 
             alt="${member.spouse_name}"
             class="avatar" />
        <div class="name">${member.spouse_name}</div>
      </div>
    `
      : "";
    const breakName = (name) => {
      if (name.length > 13) {
        const nameArr = name.split(" ");
        let result = [];
        for (let i = 0; i < nameArr.length; i += 3) {
          result.push(nameArr.slice(i, i + 3).join(" "));
        }
        return result.join("<br>");
      }
      return name;
    };
    return `
      <div class="member-container">
        <div class="member">
          <img src="${member.profile_picture || APP_CONSTANTS.defaultAvatar}" 
               alt="${member.full_name_vn}"
               class="avatar" />
          <div class="name">${breakName(member.full_name_vn)}</div>
          <div class="date">${member?.birth_date || ""}</div>
          ${
            member.death_date
              ? `<div class="date">${member.death_date}</div>`
              : ""
          }
        </div>
        ${spouseHtml}
      </div>
    `;
  };

  const renderTree = (members, level = 0) => {
    if (members.length === 0) return "";

    return `
      <ul class="level-${level}">
        ${members
          .map(
            (member, index) => `
          <li>
            ${renderMember(member)}
            ${
              member.children && member.children.length > 0
                ? renderTree(member.children, level + 1)
                : ""
            }
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  };

  const styles = `
    body { 
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: auto;
    }
    .tree {
      display: inline-block;
      white-space: nowrap;
      min-width: 100%;
      padding: 20px;
    }
    ul {
      padding-top: 20px;
      position: relative;
      transition: all 0.5s;
      display: flex;
      justify-content: center;
    }
    li {
      float: left;
      text-align: center;
      list-style-type: none;
      position: relative;
      padding: 20px 5px 0 5px;
    }
    li::before, li::after {
      content: '';
      position: absolute;
      top: 0;
      right: 50%;
      border-top: 2px solid #ccc;
      width: 50%;
      height: 20px;
    }
    li::after {
      right: auto;
      left: 50%;
      border-left: 2px solid #ccc;
    }
    li:only-child::after, li:only-child::before {
      display: none;
    }
    li:only-child {
      padding-top: 0;
    }
    li:first-child::before, li:last-child::after {
      border: 0 none;
    }
    li:last-child::before {
      border-right: 2px solid #ccc;
      border-radius: 0 5px 0 0;
    }
    li:first-child::after {
      border-radius: 5px 0 0 0;
    }
    ul ul::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      border-left: 2px solid #ccc;
      width: 0;
      height: 20px;
    }
    .member-container {
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .member, .spouse {
      border: 2px solid #ccc;
      padding: 5px;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      width: 120px;
      height: 180px;
      margin: 0 5px;
      overflow: hidden;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      margin-bottom: 5px;
    }
    .name {
      font-size: 14px;
      font-weight: bold;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      max-height: 42px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .date {
      font-size: 12px;
    }
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${styles}</style>
      </head>
      <body>
        <div class="tree">
          ${renderTree([data])}
        </div>
      </body>
    </html>
  `;
};
