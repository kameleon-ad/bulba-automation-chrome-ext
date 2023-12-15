document.getElementById('upload').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: upload,
        });
    });
});


document.getElementById('solve').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: solve,
        });
    });
});


document.getElementById('solve3').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: solve3,
        });
    });
});


// document.getElementById('upload-problem').addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         chrome.scripting.executeScript({
//             target: {tabId: tabs[0].id},
//             function: extract_question_region,
//         });
//     });
// });


function solve3() {
    let [_, prompt, response_a, response_b] = Array
        .from(document.getElementsByClassName('MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded'))
        .map(element => element.innerHTML);
    let api_link = 'http://181.41.143.154:5000/api/bulba_v3';

    fetch(api_link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            prompt,
            response_a,
            response_b,
        }),
        redirect: 'follow',
    })
}


function solve() {
    const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    const changeEvent = new Event("change", { bubbles: true });
    const category_selector = "span.MuiButtonBase-root.MuiIconButton-root.MuiCheckbox-root.MuiCheckbox-colorPrimary.MuiIconButton-colorPrimary";

    const CODE_RELATED_QUESTION = "Is the prompt code-related? *";
    const CODE_CATEGORY_QUESTION = "Please select the category for the Code-Related Prompt: *";
    const EXPERTISE_LEVEL_QUESTION = "What is your expertise level with the subject(s) of this prompt? *";
    const COMPLEXITY_QUESTION = "In your view, how complex is this prompt? *";
    const CLARITY_QUESTION = "Rate the clarity of the prompt. *";
    const ESTIMATION_TIME_QUESTION = "Estimate how long, in minutes, it would take you to answer this prompt from scratch (i.e., without the help of an AI model response). *";

    const A_FOLLOW_INSTRUCTION_QUESTION = "Did the response A follow the instructions it was given in the prompt (both explicit and implicit)?"
    const B_FOLLOW_INSTRUCTION_QUESTION = "Did the response B follow the instructions it was given in the prompt (both explicit and implicit)?"
    const A_TRUTHFUL_CORRECT_QUESTION = "Is Response A truthful and correct? *";
    const B_TRUTHFUL_CORRECT_QUESTION = "Is Response B truthful and correct? *";
    const A_WELL_WRITTEN_QUESTION = "Is Response A well written? *";
    const B_WELL_WRITTEN_QUESTION = "Is Response B well written? *";
    const A_HOW_VERBOSE_QUESTION = "How verbose is Response A?";
    const B_HOW_VERBOSE_QUESTION = "How verbose is Response B?";
    const A_SAFE_QUESTION = "How safe and harmless is Response A? *";
    const B_SAFE_QUESTION = "How safe and harmless is Response B? *";
    const A_OVERALL_QUALITY = "Rate Response A’s overall quality. *";
    const B_OVERALL_QUALITY = "Rate Response B’s overall quality. *";
    const A_ESTIMATE_TIME_QUESTION = "Estimate how long it would take you to answer this prompt starting from Model A response. *";
    const B_ESTIMATE_TIME_QUESTION = "Estimate how long it would take you to answer this prompt starting from Model B response. *";
    const SXS_SCORE_QUESTION = "Side by Side (SxS) Score";
    const SXS_SCORE_EXPLANATION_QUESTION = "SxS Score Explanation *";
    const SXS_CONFIDENCE_QUESTION = "SxS Confidence: Rate your confidence level in your assessment *";

    function extractAlphabets(str) {
      // This regex matches any alphabetic character
      const matches = str.match(/[A-Za-z]+/g);
      // The match method returns an array of all matches
      // Join the array elements into a single string
      return matches ? matches.join('') : '';
    }

    const submit = (second) => {
        const footer_right_block = document.querySelector("div.task-footer__right ");
        const submit_btn = footer_right_block.children[1].querySelector("button");

        submit_btn.dispatchEvent(clickEvent);
    };

    const get_remain_time = () => {
        const clock_text = document.getElementById("claim_timer_parent_element").children[2].children[1].children[1].children[0].innerText;
        const parser = /(\d+)\s*hours?,\s*(\d+)\s*minutes?/;
        
        console.log(clock_text);
    }
    get_remain_time();

    const visit_prompt_response = (period = 5) => {
        const next_btn = document.querySelectorAll("button>span>svg")[1].parentElement.parentElement;
        for (let idx = 1; idx < 4; idx++) {
            setTimeout(() => {
                next_btn.dispatchEvent(clickEvent);
            }, period * idx * 1000);
        }
    };

    visit_prompt_response();

    const interact_with_vertical_slider = (ele = document.createElement("span"), pos, range) => {
        const {width, height, bottom, left} = ele.getBoundingClientRect();
        console.log(width, height, bottom, left);
        const mousedownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            offsetX: 2 + (width / (range - 1) * pos) + left,
            offsetY: height / 2 + bottom,
        });
        const mouseupEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true,
            offsetX: 2 + (width / (range - 1) * pos) + left,
            offsetY: height / 2 + bottom,
        });
        ele.dispatchEvent(mousedownEvent);
        ele.dispatchEvent(mouseupEvent);
    }

    const find_block_by_question = (question, tag="span") => {
        let rlt = Array
            .from(document.querySelectorAll(tag))
            .find(element => extractAlphabets(element.innerText) === extractAlphabets(question));
        while (rlt.getAttribute("tabindex") !== "0") {
            rlt = rlt.parentElement;
        }
        return rlt;
    }

    const interact_related = (result) => {
        return new Promise ((resolve) => {
            const code_related_block = find_block_by_question(CODE_RELATED_QUESTION);
            const code_related_ele = code_related_block.querySelectorAll("input")[1];
            if (result.category['code-related']) {
                code_related_ele.dispatchEvent(clickEvent);
            } else {
                return;
            }
            return resolve();
        })
    };

    const check_category_select_dep = () => {
        return new Promise((resolve) => {
            const interval_handler = setInterval(() => {
                const elements = document.querySelectorAll(category_selector);
                if (elements.length > 1) {
                    clearInterval(interval_handler);
                    return resolve();
                }
            }, 1000);
        });
    };

    const check_matched_category = (result) => {
        const code_category_block = find_block_by_question(CODE_CATEGORY_QUESTION);
        const category = result.category.category.replace(" - ", " ");
        let nb_try = 0;
        return new Promise((resolve) => {
            const setupTimeoutForCategroySelection = () => {
                nb_try += 1;
                if (nb_try === 5) {
                    return;
                }
                const input_elements = code_category_block.querySelectorAll("input");
                if (input_elements.length === 2) {
                    input_elements[1].dispatchEvent(clickEvent);
                }
                setTimeout(() => {
                    const target_ele = Array.from(document.querySelectorAll("label.MuiFormControlLabel-root")).find(ele => {
                        return ele.innerText.includes(category);
                    });
                    if (target_ele) {
                        target_ele.parentElement.querySelector("input").dispatchEvent(clickEvent);
                        return resolve();
                    }
                    setupTimeoutForCategroySelection();
                }, 1000);
            };
            setupTimeoutForCategroySelection();
        });
    };

    const writing_value = (ele=document.createElement("input"), value) => {
        ele.value = value;
        ele.dispatchEvent(changeEvent);
    };

    const select_item = (block=document.createElement("div"), {type}) => {
        block.querySelectorAll("label.MuiFormControlLabel-root")[type].querySelector("input").dispatchEvent(clickEvent);
    };

    const type_and_result_interact = (block=document.createElement("div"), {type, reason}) => {
        select_item(block, {type});
        if (reason) {
            const reason_area = block.nextElementSibling.querySelector("textarea");
            reason_area?.value = reason;
            reason_area?.dispatchEvent(changeEvent);
        }
    };

    const sxs_interact = (sxs_result) => {
        const sxs_score_block = find_block_by_question(SXS_SCORE_QUESTION);
        const sxs_score_slider = sxs_score_block.querySelector("span.MuiSlider-marked");
        interact_with_vertical_slider(sxs_score_slider, sxs_result.rate_which_is_better, 7);
        const sxs_block = find_block_by_question(SXS_SCORE_EXPLANATION_QUESTION, "div");
        writing_value(sxs_block.querySelector("textarea"), sxs_result.why);
    };

    const sliding_and_result = (block=document.createElement("div"), {type, reason}, range) => {
        const slider = block.querySelector("span.MuiSlider-marked");
        interact_with_vertical_slider(slider, type, range);
        if (reason) {
            const reason_area = block.nextElementSibling.querySelector("textarea");
            reason_area.value = reason;
            reason_area.dispatchEvent(changeEvent);
        }
    };

    const interact_category = (result) => {
        check_matched_category(result).then(() => {
            const clarity_block = find_block_by_question(CLARITY_QUESTION);
            const expertise_level = find_block_by_question(EXPERTISE_LEVEL_QUESTION);
            const complexity_block = find_block_by_question(COMPLEXITY_QUESTION);
            const estimation_time_block = find_block_by_question(ESTIMATION_TIME_QUESTION, "div");
            const estimizted_time = [15, 45, 75][result.category.complexity];
            clarity_block.querySelectorAll('input')[result.category.clarity].dispatchEvent(clickEvent);
            expertise_level.querySelectorAll('input')[1].dispatchEvent(clickEvent);
            complexity_block.querySelectorAll('input')[result.category.complexity].dispatchEvent(clickEvent);
            writing_value(estimation_time_block.querySelector("input"), `${estimizted_time}`);

            const follow_instruction_a_block = find_block_by_question(A_FOLLOW_INSTRUCTION_QUESTION);
            const follow_instruction_b_block = find_block_by_question(B_FOLLOW_INSTRUCTION_QUESTION);
            const truthful_a_block = find_block_by_question(A_TRUTHFUL_CORRECT_QUESTION);
            const truthful_b_block = find_block_by_question(B_TRUTHFUL_CORRECT_QUESTION);
            const well_written_a_block = find_block_by_question(A_WELL_WRITTEN_QUESTION);
            const well_written_b_block = find_block_by_question(B_WELL_WRITTEN_QUESTION);
            const verbose_a_block = find_block_by_question(A_HOW_VERBOSE_QUESTION);
            const verbose_b_block = find_block_by_question(B_HOW_VERBOSE_QUESTION);
            const safe_a_block = find_block_by_question(A_SAFE_QUESTION);
            const safe_b_block = find_block_by_question(B_SAFE_QUESTION);
            const rate_overall_quality_a_block = find_block_by_question(A_OVERALL_QUALITY);
            const rate_overall_quality_b_block = find_block_by_question(B_OVERALL_QUALITY);
            const estimiated_time_a_block = find_block_by_question(A_ESTIMATE_TIME_QUESTION, "div");
            const estimiated_time_b_block = find_block_by_question(B_ESTIMATE_TIME_QUESTION, "div");
            const confidence_block = find_block_by_question(SXS_CONFIDENCE_QUESTION);
            
            let {type: estimated_time_level_a} = result.ftw.overall_quality.A;
            estimated_time_level_a *= (estimizted_time / 5)
            let {type: estimated_time_level_b} = result.ftw.overall_quality.B;
            estimated_time_level_b *= (estimizted_time / 5)

            type_and_result_interact(follow_instruction_a_block, result.ftw.follow_instruction.A);
            type_and_result_interact(follow_instruction_b_block, result.ftw.follow_instruction.B);
            type_and_result_interact(truthful_a_block, result.truthful_and_correct.A);
            type_and_result_interact(truthful_b_block, result.truthful_and_correct.B);
            type_and_result_interact(well_written_a_block, result.ftw.well_written.A);
            type_and_result_interact(well_written_b_block, result.ftw.well_written.B);
            sliding_and_result(verbose_a_block, result.verbose.A)
            sliding_and_result(verbose_b_block, result.verbose.B)
            type_and_result_interact(safe_a_block, result.safe_and_harmless.A);
            type_and_result_interact(safe_b_block, result.safe_and_harmless.B);
            select_item(rate_overall_quality_a_block, result.ftw.overall_quality.A);
            select_item(rate_overall_quality_b_block, result.ftw.overall_quality.B);
            writing_value(estimiated_time_a_block.querySelector("input"), `${estimated_time_level_a}`);
            writing_value(estimiated_time_b_block.querySelector("input"), `${estimated_time_level_b}`);
            confidence_block.querySelectorAll("input")[3].dispatchEvent(clickEvent);

            sxs_interact(result.ftw.sxs);
        });
    }

    let [_, prompt, response_a, response_b] = Array
        .from(document.getElementsByClassName('MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded'))
        .map(element => element.innerHTML);
    let api_link = 'http://181.41.143.154:5000/api/bulba_v2';

    fetch(api_link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            prompt,
            response_a,
            response_b,
        }),
        redirect: 'follow',
    }).then(res => res.json())
    .then(result => {
        interact_related(result)
            .then(() => {
                check_category_select_dep()
                    .then(() => {
                        interact_category(result);
                    });
            });
    });
}


function upload() {
    let [instruction, prompt, response_a, response_b] = Array
        .from(document.querySelectorAll('[class*="MuiPaper-root-"], [class*="MuiPaper-elevation1-"], [class*="MuiPaper-rounded-"]'))
        .map(element => element.innerHTML);
    let upload_url = 'http://181.41.143.154:5000/api/htmls/feedbacks';
    let task_id;
    
    if (!instruction) {
        [instruction, prompt, response_a, response_b] = Array
            .from(document.getElementsByClassName('MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded'))
            .map(element => element.innerHTML);
        upload_url = 'http://181.41.143.154:5000/api/htmls/problems';
        const task_id_element = document.querySelector('div > strong + em');
        task_id = task_id_element.textContent.trim();
    } else {
        const task_id_element = document.querySelectorAll('div > strong + em')[1];
        task_id = task_id_element.textContent.trim();
    }
    
    fetch(upload_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            task_id,
            html_content: document.documentElement.innerHTML,
            instruction,
            prompt,
            response_a,
            response_b,
        }),
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(() => {
        alert("success");
    })
    .catch(error => {
        alert("error");
        console.log(error);
    });
}


function extract_question_region() {
    let [_instruction, prompt, response_a, response_b] = Array
        .from(document.querySelectorAll('[class*="MuiPaper-root-"], [class*="MuiPaper-elevation1-"], [class*="MuiPaper-rounded-"]'))
        .map(element => element.innerHTML);
    const question_group = document.querySelector('[class*=MuiTree]').children[1];
    const keywords = [
        "both explicit and implicit",
        "truthful and correct?",
        "well written?",
        "How verbose is",
        "safe and harmless",
    ];
    // let tmp_keywords = [...keywords];
    question_group
        .childNodes
        .forEach(child => {
            const target_node = Array.from(child.children).pop().childNodes[0].childNodes[0].childNodes[0];
            const question_ele = target_node.childNodes[0];
            const answer_ele = target_node.childNodes[1];
            const question = question_ele.innerText.trim();
            const answer = answer_ele.innerText.trim();
            // if (tmp_keywords.findIndex(keyword => {
            //     if (!question.includes(keyword)) {
            //         return false;
            //     }
            //     tmp_keywords = tmp_keywords.filter(one => one != keyword)
            //     return true;
            // }) != -1) {
            //     fetch("http://127.0.0.1:5000/api/questions", {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: new URLSearchParams({
            //             question,
            //         }),
            //         redirect: 'follow'
            //     })
            //     .then(response => response.json())
            //     .then(() => {
            //         alert("success");
            //     })
            //     .catch(error => {
            //         alert("error");
            //         console.log(error);
            //     });
            // }
            const keyword = keywords.find(keyword => question.includes(keyword));
            if (keyword) {
                pl = true;
                let response = question.includes("esponse A") ? response_a : response_b;
                fetch("http://127.0.0.1:5000/api/answers", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        question,
                        response,
                        answer,
                        prompt,
                    }),
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(() => {
                    alert("success");
                })
                .catch(error => {
                    alert("error");
                    console.log(error);
                });
            }
        });
}
