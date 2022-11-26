import {Component, OnInit} from '@angular/core';
import {Howl, Howler} from 'howler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title : string = 'Web Audio Player';
  currentAudioIndex : number = 0;
  playPercent : number = 0;
  endTime : string = "0:00";
  currentPlayingTime : string = "0:00";
  playBackSpeed : string = "1.0X";
  playButtonImage : string = "assets/images/play.png";
  muteButtonImage : string = "assets/images/audio.png";
  isPlayHeadVisible : boolean = false;
  isAutoPlaySet : boolean = true;
  isPreviousButtonDisabled : boolean = false;
  isNextButtonDisabled : boolean = false;
  isMenuVisible : boolean = false;
  audioList! : {audio: {audio_link: string, audio_name: string}[]};
  audioFile! : HTMLAudioElement;
  currentAudioLink! : string;
  currentAudioName! : string;

  ngOnInit(): void {
    this.audioList = {
      "audio" : [
        {"audio_link" : "assets/audio/audio_1.mp3", "audio_name" : "Light and Dark"},
        {"audio_link" : "assets/audio/audio_2.mp3", "audio_name" : "Shake Shake"},
        {"audio_link" : "assets/audio/audio_3.mp3", "audio_name" : "You and I"}
      ]
    };
    this.loadAudioProperties(this.currentAudioIndex);
  }

  loadAudioProperties(audioIndex: number) {
    if (audioIndex >= 0 && audioIndex <= this.audioList.audio.length - 1) {
      this.currentAudioLink = this.audioList.audio[audioIndex].audio_link;
      this.currentAudioName = this.audioList.audio[audioIndex].audio_name;
    }
    this.disableNextOrPreviousButton();
  }

  onLoaded(audio: HTMLAudioElement) {
    this.audioFile = audio;
    this.endTime = this.formatTime(this.audioFile.duration);
  }

  formatTime(duration: number) : string {
    let minutes : number = Math.floor(duration / 60);
    let seconds : number = Math.floor(duration % 60);

    return (seconds <= 9) ? minutes + ":0" + seconds : minutes + ":" + seconds;
  }

  playAudio() : void {
    if (this.audioFile.paused) {
      this.audioFile.play();
    } else {
      this.audioFile.pause();
    }
  }

  togglePlayButtonImage(isPaused: boolean) : void {
    if (isPaused) {
      this.playButtonImage = "assets/images/play.png";
    } else {
      this.playButtonImage = "assets/images/pause.png";
    }
  }

  nextAudio() : void {
    this.loadAudioProperties(++this.currentAudioIndex);
    this.togglePlayButtonImage(true);
    if (this.isAutoPlaySet) setTimeout(this.playAudio, 200);
  }

  previousAudio() : void {
    this.loadAudioProperties(--this.currentAudioIndex);
    this.togglePlayButtonImage(true);
    if (this.isAutoPlaySet) setTimeout(this.playAudio, 200);
  }

  disableNextOrPreviousButton() : void {
    switch (this.currentAudioIndex) {
      case 0:
        this.isPreviousButtonDisabled = true;
        this.isNextButtonDisabled = false;
        break;
      case (this.audioList.audio.length - 1):
        this.isNextButtonDisabled = true;
        this.isPreviousButtonDisabled = false;
        break;
      default:
        this.isNextButtonDisabled = this.isPreviousButtonDisabled = false;
    }
  }

  timeUpdate() : void {
    this.currentPlayingTime = this.formatTime(this.audioFile.currentTime);
    this.playPercent = (this.audioFile.currentTime / this.audioFile.duration) * 100;
  }

  changeSpeed() : void {
    switch (this.audioFile.playbackRate) {
      case 1:
        this.audioFile.playbackRate = 2;
        this.playBackSpeed = "2.0X";
        break;
      case 2:
        this.audioFile.playbackRate = 3;
        this.playBackSpeed = "3.0X";
        break;
      case 3:
        this.audioFile.playbackRate = 1;
        this.playBackSpeed = "1.0X";
        break;
      default:
        this.audioFile.playbackRate = 1;
        this.playBackSpeed = "1.0X";
        break;
    }
  }

  muteAudio() : void {
    this.audioFile.muted = (!this.audioFile.muted);
    this.muteButtonImage = (this.muteButtonImage === "assets/images/audio.png") ? "assets/images/audio_mute.png" :
                             "assets/images/audio.png";
  }

  togglePlayHeadVisibility() : void {
    this.isPlayHeadVisible = (!this.isPlayHeadVisible);
  }

  moveToNext() : void {
    if (this.isAutoPlaySet && this.currentAudioIndex !== this.audioList.audio.length - 1) this.nextAudio();
  }

  toggleAutoPlaySet() : void {
    this.isAutoPlaySet = (!this.isAutoPlaySet);
  }

  toggleMenuVisibility() {
    this.isMenuVisible = (!this.isMenuVisible);
  }

  playSelected(audioIndex: number) {
    this.currentAudioIndex = audioIndex;
    this.loadAudioProperties(this.currentAudioIndex);
    this.toggleMenuVisibility();
    setTimeout(() => this.playAudio(), 200);
  }

  howlerAudio : Howl = new Howl({
    src: ["assets/audio/audio_1.mp3"]
  });

  playHowlerAudio() {
    this.howlerAudio.play();
    setTimeout(() => this.howlerAudio.pause(), 5000);
  }

  setEventListenersOnAudio() {
    this.howlerAudio.on("mute", () => console.log("audio muted!"));
    this.howlerAudio.on("end", () => console.log("audio ended!"));
  }


}
