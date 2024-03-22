(ns main
  (:require [clojure.string :as str]))

(defn main []
  (let [number (Long/parseLong (read-line))]
    (println (str number " squared is " (* number number)))))

(main)
