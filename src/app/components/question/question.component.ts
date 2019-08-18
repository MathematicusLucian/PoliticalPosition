import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

/** rxjs */
import { Observer, Observable, Subscription } from "rxjs";

/** models */
import { Question } from "../../models/question.model"; 

/** services */ 
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  
  public questions: Question[]; 
  public question: Observable<Question>;
  private questionsSubscription: Subscription;

  public max_questions: number;
  public current_question: number;  

  public econ: number; 
  public dipl: number; 
  public govt: number; 
  public scty: number; 

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private data: DataService,) { }

  ngOnInit() {

    this.max_questions = 70;

    this.current_question = parseInt(this.route.snapshot.paramMap.get('id'));

    if(this.current_question > this.max_questions){
   
      this.results();

    }else if(this.current_question > 1){

      let savedValues = this.data.retrieveStoredVaues(); 

      this.econ = parseInt(savedValues[0]);
      this.dipl = parseInt(savedValues[1]);
      this.govt = parseInt(savedValues[2]);
      this.scty = parseInt(savedValues[3]);

    }else{

      this.data.resetStoredVaues();

      this.econ = 0;
      this.dipl = 0;
      this.govt = 0;
      this.scty = 0;

    }

    //subscribe to questions, from questions.json
    this.questionsSubscription = this.data.getQuestions().subscribe(res => { 
      this.questions = [];
      this.questions.push(res[this.current_question-1]);
    });  

  }

  ngOnDestroy(): void {

    //destroy the questions subscription
    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }

  }

  questionResponse(mult: number){
    this.econ += mult * this.questions[0].econ;
    this.dipl += mult * this.questions[0].dipl;
    this.govt += mult * this.questions[0].govt;
    this.scty += mult * this.questions[0].scty; 

    //update storage
    this.data.saveStoredVaues(this.econ, this.dipl, this.govt, this.scty);

    console.log(this.data.retrieveStoredVaues());
    
    this.current_question++; 

    if (this.current_question < this.max_questions) {
      //reroute
      this.router.navigate(['/question', this.current_question]);
      
    } else {
      this.results();
    }
  }

  results(){

    //reroute
    this.router.navigate(['/results', this.econ, this.dipl, this.govt, this.scty]);

  }

}
