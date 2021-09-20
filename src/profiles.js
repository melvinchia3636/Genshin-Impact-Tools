function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }; downloadObjectAsJson({
    profile: {
        images: {
            card: $("[title='Card']").attr("href"),
            portrait: $("[title='Portrait']").attr("href"),
            in_game: $("[title='In Game']").attr("href"),
        },
        bio: {
            rarity: parseInt($('[data-source="rarity"] img').attr("alt").split(" ")[0]),
            weapon: $('[data-source="weapon"] a').last().text().toLowerCase(),
            element: $('[data-source="element"] a').last().text().toLowerCase(),
            ...Object.fromEntries(Array.from($('.wds-tabber').last().children().eq(1).children('div')).map((e, i) => [$(e).children('h3').text().toLowerCase().replace(/\s/g, '_'), $(e).children('div').text().trim()]))
        },
        family: Object.fromEntries(Array.from($('.wds-tabber').last().children().eq(2).children('div')).map((e, i) => [$(e).children('h3').text().toLowerCase().replace(/\s/g, '_'), $(e).children('div').text().trim()])),
        voice_actors: Object.fromEntries(Array.from($('.wds-tabber').last().children().eq(3).children('div')).map((e, i) => [$(e).children('h3').text().toLowerCase().replace(/\s/g, '_'), $(e).children('div').text().trim()])),
        introduction: {
            quote: $('#Introduction').parent().next().children('.pull-quote__text').text(),
            content: "C+V Here"
        },
        personality: {
            quote: $('#Personality').parent().next().children('.pull-quote__text').text(),
            content: $('#Personality').parent().nextUntil($("#Appearance").parent()).slice(1).map((i, e) => $(e).text()).get()
        },
        appearance: $('#Appearance').parent().nextUntil($("#Combat_Info").parent()).map((i, e) => $(e).text()).get()
    }
}, "hmm")