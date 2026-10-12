import { Link } from "react-router";
import { ArrowDown, ArrowRight, Asterisk } from "lucide-react";
import "./hero.css";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__artwork" aria-hidden="true">
        <div className="hero__halo" />
        <div className="hero__halo hero__halo--inner" />

        <img
          className="hero__portrait"
          src="/images/hero-backpiece.jpg"
          alt=""
          fetchPriority="high"
        />

        <div className="hero__image-shade" />
      </div>

      <div className="hero__content">
        <div className="hero__eyebrow">
          <span>Salt Lake City, Utah</span>
          <span className="hero__eyebrow-line" />
        </div>

        <h1 className="hero__title" id="hero-title">
          Tattoos
          <br />
          that mean
          <br />
          <span>something.</span>
        </h1>

        <p className="hero__descriptor">
          Custom tattoos <span>/</span> Fine art <span>/</span> SLC, UT
        </p>

        <p className="hero__description">
          Art that tells your story. Created with intention. Made to stay with you.
        </p>

        <div className="hero__actions">
          <Link className="hero__button" to="/portfolio">
            <span>Explore our work</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>

          <Link className="hero__text-link" to="/artists">
            Meet the artists
          </Link>
        </div>
      </div>

      <div className="hero__signature">
        <Asterisk className="hero__signature-mark" size={46} strokeWidth={1} aria-hidden="true" />
        <p>
          More than ink.
          <br />
          <em>It's a part of you.</em>
        </p>
      </div>

      <a className="hero__scroll" href="#portfolio">
        <span>Scroll to explore</span>
        <ArrowDown size={17} strokeWidth={1} />
      </a>

      <span className="hero__index" aria-hidden="true">
        01 <span>/</span> 05
      </span>
    </section>
  );
}
