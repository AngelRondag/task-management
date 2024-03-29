import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../../redux/actions";
import { Task } from "../Task";
import styles from "./ListTask.module.css";
import { useTranslation } from "react-i18next";

const ListTask = ({ tasks, message }) => {
  const { t } = useTranslation("global");

  const dispatch = useDispatch();
  const displaymessage = useSelector((state) => state.displayMesaage);
  const [showNotification, setShowNotication] = useState(displaymessage);

  useEffect(() => {
    setTimeout(() => {
      setShowNotication(false);
      dispatch(setMessage(false));
    }, 6000);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-xl items-center gap-6 mt-10 mb-20">
      {showNotification && (
        <p className={styles.notification}>
          {t("message.repeated_task")}
        </p>
      )}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Task
            key={task.title}
            pogress={task.pogress}
            title={task.title}
            description={task.description}
            time={task.time}
            id={task.id}
            taskGroup={task.taskGroup}
            content={task.content}
          />
        ))
      ) : (
        <p className="text-cust-intermediate w-4/5 text-center mt-10">
          {message}
        </p>
      )}
    </div>
  );
};

export { ListTask };
