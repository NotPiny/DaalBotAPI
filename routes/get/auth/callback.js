const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
*/

module.exports = async(req, res) => {
    const code = req.query.code; // Get the code from discord
    if (!code) return res.redirect('/'); // If there is no code, redirect to the home page

    const internalReq = await axios.get({ // Get info from internal API
        url: 'https://bot.daalbot.xyz/get/auth/accessCode?code=' + code,
    });

    const data = internalReq.data; // Get the data from the internal API

    if (internalReq.status !== 200) return res.send('Internal API error please try again'); // If the status is not 200, redirect to the home page

    const encodedData = btoa(JSON.stringify(data)); // Encode the data

    // Get the user's id name and avatar
    const userReq = await axios.get({
        url: 'https://discord.com/api/users/@me',
        headers: {
            authorization: `Bearer ${data}`
        }
    })

    const userData = userReq.data; // Get the user's data

    if (userReq.status !== 200) return res.send('Unable to get user data please try again'); // If the status is not 200, redirect to the home page

    const guildsReq = await axios.get({ // Get the user's guilds
        url: 'https://discord.com/api/users/@me/guilds',
        headers: {
            authorization: `Bearer ${data}`
        }
    })

    const guildsData = guildsReq.data; // Get the user's guilds data

    if (guildsReq.status !== 200) return res.send('Unable to get user guilds please try again'); // If the status is not 200, redirect to the home page

    const guilds = []; // Create an array for the guilds

    guildsData.forEach(guild => { // Loop through the guilds
        guilds.push({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            iconURL: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        })
    })

    const user = {
        id: userData.id,
        name: userData.username,
        avatar: userData.avatar,
        avatarURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
        guilds: guilds
    }

    const encodedUser = btoa(JSON.stringify(user)); // Encode the user data

    res.redirect(`https://daalbot.xyz/api/transfer/?code=${encodedData}?user=${encodedUser}`); // Redirect to the transfer page with the encoded data
}