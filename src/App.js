import React, { Component } from "react";

import DataStore from "./stores/DataStore";

import Header from "./components/Header";
import YearSlider from "./components/YearSlider";
import MediaGrid from "./components/MediaGrid";

class App extends Component {
  constructor(props) {
    super(props);
    this.store = new DataStore();
  }

  render() {
    return (
      <div>
        <aside className="bg-secondary mb-4">
          <div className="container-fluid">
            <div className="p-2">
              <a
                className="text-white"
                href="https://ben.bristow.me/portfolio_items/memorylane.html"
              >
                &larr; Back to ben.bristow.me
              </a>{" "}
            </div>
          </div>
        </aside>

        <main className="container-fluid">
          <Header store={this.store} />
          <YearSlider store={this.store} />

          <div className="row">
            <div className="col-lg-6">
              <MediaGrid store={this.store} category="tracks" />
            </div>
            <div className="col-lg-6">
              <MediaGrid store={this.store} category="movies" />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
