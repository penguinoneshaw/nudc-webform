import {entry_fee} from './entry_fees';
// import 'jszip/dist/jszip.min.js';
// import 'file-saver/dist/FileSaver.min.js';

async function process_and_save(form) {
    let zip = new JSZip();

    const {basic_information, competitors, offbeat, couples, events, offbeat_team, total_entry} = form;
    form.late = true; 

    zip.file(`${basic_information.university}/json/full_save.json`, JSON.stringify({
        basic_information,
        competitors,
        couples,
        offbeat
    }));
    zip.file(`${basic_information.university}/basic_information.txt`, `University: ${basic_information.university}\nTeam Captain(s): ${basic_information.team_captain}\nEmail: ${basic_information.tc_email}\nCoach Names: ${basic_information.coaches_names}\nTotal Entry Fee: ${total_entry}`);

    const competitors_list = Object.values(competitors).reduce((prev, competitor) => {
        return prev + `"${competitor.name}",${competitor.student_status},${competitor.beginner},${competitor.alien},"${competitor.release_from || ''}",${entry_fee(competitor)}\n`;
    }, '');
    zip.file(`${basic_information.university}/competitors.csv`, 'name,student status,beginner?,alien?,release,entry_fee\n' + competitors_list);

    const couples_list = Object.values(couples).reduce((prev, next) => {
        return prev + `"${competitors[next.lead].name}","${competitors[next.follow].name}",${next.events.sort().join(',')}\n`;
    }, 'lead,follow,events\n');

    zip.file(`${basic_information.university}/couples.csv`, couples_list);

    Object.values(events).filter(evt => evt.competing_couples.length != 0).forEach((evt) => {
        let event_list = 'lead,follow\n';
        event_list = evt.competing_couples.reduce((prev, couple) => {
            return prev + `"${competitors[couples[couple].lead].name}",${competitors[couples[couple].follow].name}\n`;
        }, event_list);
        zip.file(`${basic_information.university}/event_file/${basic_information.university}.${evt.category}-${evt.name}.csv`, event_list);
    });

    if (offbeat) zip.file(`${basic_information.university}/offbeat_team.csv`, offbeat_team.reduce((prev, member) => prev + `${member.name},${member.student_status}\n`, 'name,student status\n'));


    const blob = await zip.generateAsync({type:'blob'});
    saveAs(blob, `${basic_information.university}.zip`);
}

export default process_and_save;