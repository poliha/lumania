import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lapi } from '../../providers/lapi';
import { AuthService } from '../../providers/auth-service';
import { ToastService } from '../../providers/toast-service';
import { LoadingService } from '../../providers/loading-service';


@IonicPage()
@Component({
  selector: 'page-contact-form',
  templateUrl: 'contact-form.html',
})
export class ContactForm {
		message: {subject: string, content: string} = {
		'subject': "",
  	'content': ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public lapi: Lapi,  public loadingService: LoadingService,
    public toastService: ToastService, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactForm');
  }

  send(){
    this.loadingService.showLoader("Sending message...");
  	let options = {
  			'subject': this.message.subject,
  			'content': this.message.content,
  			'sender_name': this.authService.user.details.name,
  			'sender_email': this.authService.user.details.email,
  			'token': this.authService.getLapiToken(),
  			'uuid': this.authService.getUuid()
  		};

  		this.lapi.contactForm(options)
  			.map(res => res.json())
  			.subscribe((resp) => {
              console.log(resp);
              this.loadingService.hideLoader();
              this.toastService.showToast("Message Sent");
              this.navCtrl.pop();


         },
         (err:any)=>{
        	this.loadingService.hideLoader();
          console.log(err.json());
          // let errorObj = err.json();
          this.toastService.showToast("Message Not Sent");

        });
  }

}
